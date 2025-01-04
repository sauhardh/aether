const apiBase = "/v1/login";

const landlordSelect = document.getElementById("landlord-select");
const connectBtn = document.getElementById("connect-btn");
const disconnectBtn = document.getElementById("disconnect-btn");
const webrtcSection = document.getElementById("webrtc-section");
const loginSection = document.getElementById("login-section");
const remoteVideo = document.getElementById("remote-video");

let peerConnection = null;
let landlordUUID = null;

const ICE_SERVERS = [
    {
        "urls": [
            "stun:stun.l.google.com:19302"
        ]
    }
]

async function fetchLandlords() {
    try {
        const response = await fetch(`${apiBase}/peers`);
        const landlords = await response.json();

        landlordSelect.innerHTML = landlords
            .map(
                (landlord) => `<option value="${landlord.landlord_uuid}">${landlord.landlord_uuid}</option>`
            )
            .join("");

        if (landlords.length === 0) {
            landlordSelect.innerHTML = `<option disabled>No landlords available</option>`;
        }
    } catch (error) {
        alert("Failed to load landlords. Please try again.");
    }
}

async function connectToLandlord() {
    landlordUUID = landlordSelect.value;
    if (!landlordUUID) {
        alert("Please select a landlord.");
        return;
    }

    var config = {
        iceServers: ICE_SERVERS,
    }

    peerConnection = new RTCPeerConnection(config);

    peerConnection.addTransceiver('video', { 'direction': 'recvonly' })

    peerConnection.oniceconnectionstatechange = e => { console.log(peerConnection.iceConnectionState); console.log(e); }
    peerConnection.onicecandidate = event => {
        console.log(event)
    }


    peerConnection.addEventListener('track', (evt) => {
        console.log(evt);
        if (evt.track.kind == 'video') {
            remoteVideo.srcObject = evt.streams[0];
            remoteVideo.onloadedmetadata = () => {
                remoteVideo.style.height = "60vh";
                remoteVideo.style.aspectRatio = `${remoteVideo.videoWidth}/${remoteVideo.videoHeight}`;
                remoteVideo.controls = false;
            }

            remoteVideo.play();
        }
    });


    peerConnection.createOffer().then((offer) => {
        return peerConnection.setLocalDescription(offer);
    }).then(() => {
        return new Promise((resolve) => {
            if (peerConnection.iceGatheringState === 'complete') {
                resolve();
            } else {
                const checkState = () => {
                    if (peerConnection.iceGatheringState === 'complete') {
                        peerConnection.removeEventListener('icegatheringstatechange', checkState);
                        resolve();
                    }
                };
                peerConnection.addEventListener('icegatheringstatechange', checkState);
            }
        });
    }).then(() => {
        var offer = peerConnection.localDescription;

        fetch(
            `${apiBase}/peers`,
            {
                method: 'PUT',
                body: JSON.stringify({ landlord_uuid: landlordUUID, offer: offer }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to send offer to the server.")
            }
        }).then((data) => {
            peerConnection.setRemoteDescription(data.answer);
        }).catch((e) => {
            alert(e);
        }
        )

    }).catch((e) => {
        alert(e);
    });



    loginSection.classList.add("hidden");
    webrtcSection.classList.remove("hidden");
}

async function disconnect() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }

    await fetch(`${apiBase}/peers`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landlord_uuid: landlordUUID }),
    });

    remoteVideo.srcObject = null;
    loginSection.classList.remove("hidden");
    webrtcSection.classList.add("hidden");
}

connectBtn.addEventListener("click", connectToLandlord);
disconnectBtn.addEventListener("click", disconnect);

fetchLandlords();
