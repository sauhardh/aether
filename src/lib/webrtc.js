import { ws_WebRTCServer, ws_WebRTCServerResponse } from "./apiClient";

async function WebRTC(videoRef) {
    const config = {
        sdpSemantics: 'unified-plan',
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    };

    const peerConnection = new RTCPeerConnection(config);
    peerConnection.addTransceiver("video", { direction: "recvonly" });
    const dataChannel = peerConnection.createDataChannel("mouse_events");

    /**
     * VideoPlayer_HandleClick
     * This calculate the position of mouse clicked from the 'video' html tag and send it through the datachannel
     */
    const videoPlayer = videoRef?.current;
    function VideoPlayer_HandleClick(event) {
        const rectangle = videoPlayer.getBoundingClientRect()
        const x_ratio = (event.clientX - rectangle.left) / rectangle.width;
        const y_ratio = (event.clientY - rectangle.top) / rectangle.height;

        dataChannel.send(
            JSON.stringify({
                type: "mouse",
                payload: { "clicked_at": { x_ratio, y_ratio } },
            })
        );
    };


    dataChannel.onopen = () => {
        console.info("__Data Channel Open__")
        videoPlayer.addEventListener("click", VideoPlayer_HandleClick)
    };

    dataChannel.onclose = (event) => {
        console.info("__Data Channel Closed__")
        videoPlayer.removeEventListener("click", VideoPlayer_HandleClick)
    };

    peerConnection.oniceconnectionstatechange = () => {
        console.info("ICE_CONNECTION_STATE", peerConnection.iceConnectionState);
    };

    peerConnection.onconnectionstatechange = () => {
        console.info("CONNECTION_STATE_CHANGE", peerConnection.connectionState)
    }

    peerConnection.addEventListener("track", (event) => {
        if (event.track.kind == 'video') {
            videoPlayer.srcObject = event.streams[0];
            videoPlayer.play();
        }
    });

    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        await new Promise((resolve) => {
            if (peerConnection.iceGatheringState === "complete") {
                resolve();
            } else {
                const checkState = () => {
                    if (peerConnection.iceGatheringState === 'complete') {
                        peerConnection.removeEventListener('icegatheringstatechange', checkState);
                        resolve();
                    }
                };
                peerConnection.addEventListener("icegatheringstatechange", checkState);
            }
        });

        await ws_WebRTCServer(peerConnection.localDescription)
        const answer = await ws_WebRTCServerResponse();
        await peerConnection.setRemoteDescription(answer);

    } catch (error) {
        console.error("WebRTC error:", error);
        throw error;
    }
}

export { WebRTC };