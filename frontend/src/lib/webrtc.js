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
     * Calculates the normalized position (0.0 to 1.0) of mouse clicked inside the actual video frame
     */
    function VideoPlayer_HandleClick(event) {
        const target = videoRef?.current || videoPlayer;
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const elemWidth = rect.width;
        const elemHeight = rect.height;
        const videoWidth = target.videoWidth || elemWidth;
        const videoHeight = target.videoHeight || elemHeight;

        // Calculate pillarboxing / letterboxing offsets for object-contain
        const elemRatio = elemWidth / elemHeight;
        const videoRatio = videoWidth / videoHeight;

        let renderWidth = elemWidth;
        let renderHeight = elemHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (elemRatio > videoRatio) {
            renderWidth = elemHeight * videoRatio;
            offsetX = (elemWidth - renderWidth) / 2;
        } else {
            renderHeight = elemWidth / videoRatio;
            offsetY = (elemHeight - renderHeight) / 2;
        }

        const normX = Math.max(0, Math.min(1, (clickX - offsetX) / renderWidth));
        const normY = Math.max(0, Math.min(1, (clickY - offsetY) / renderHeight));

        if (dataChannel && dataChannel.readyState === "open") {
            dataChannel.send(
                JSON.stringify({
                    type: "mouse",
                    payload: { "clicked_at": { x_ratio: normX, y_ratio: normY } },
                })
            );
        }
    }

    dataChannel.onopen = () => {
        console.info("__Data Channel Open__");
        const target = videoRef?.current || videoPlayer;
        if (target) {
            target.addEventListener("click", VideoPlayer_HandleClick);
        }
    };

    dataChannel.onclose = () => {
        console.info("__Data Channel Closed__");
        const target = videoRef?.current || videoPlayer;
        if (target) {
            target.removeEventListener("click", VideoPlayer_HandleClick);
        }
    };

    peerConnection.oniceconnectionstatechange = () => {
        console.info("ICE_CONNECTION_STATE", peerConnection.iceConnectionState);
    };

    peerConnection.onconnectionstatechange = () => {
        console.info("CONNECTION_STATE_CHANGE", peerConnection.connectionState)
    }

    peerConnection.addEventListener("track", (event) => {
        const target = videoRef?.current || videoPlayer;
        if (event.track.kind === 'video' && target) {
            const stream = (event.streams && event.streams.length > 0 && event.streams[0])
                ? event.streams[0]
                : new MediaStream([event.track]);
            target.srcObject = stream;
            target.muted = true;
            target.play().catch((err) => console.warn("Video play error:", err));
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