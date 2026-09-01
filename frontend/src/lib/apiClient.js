const ADDRESS_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:7878";

// Fallback development token
const FALLBACK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJqb2huX2RvZSIsImlhdCI6MTczNjY2MzU4MCwiZXhwIjoxOTAwMDAwMDAwfQ.dummy";

function getToken(customToken = null) {
    if (customToken) return customToken;
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('userToken');
        if (stored) return stored;
    }
    return FALLBACK_TOKEN;
}

async function GET_Computers(userToken = null) {
    try {
        const token = getToken(userToken);
        const res = await fetch(`${ADDRESS_URL}/api/authorized/computers`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || "Could not get the computers from server");
        }
        const result = await res.json();
        return result.message || [];
    } catch (error) {
        console.error('Error occurred at get computers:', error);
        return [];
    }
}

// Gets identification token for landlord to communicate with server
async function GET_identification(userToken = null) {
    try {
        const token = getToken(userToken);
        const res = await fetch(`${ADDRESS_URL}/api/authorized/identification`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || "Could not get the token from server");
        }
        const result = await res.json();
        return result.message;
    } catch (error) {
        console.error("Error occurred on getting identification token:", error);
        throw error;
    }
}

// Posts identification token to the local landlord daemon
async function POST_locallandlord(PORT, token_id) {
    try {
        const res = await fetch(`http://localhost:${PORT}/negotiate-server`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: token_id,
                server_addr: "ws://127.0.0.1:7878"
            })
        });
        if (!res.ok) {
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error occurred on post_landlord:", error);
        return false;
    }
}

let socket = null;

async function ws_WebRTCServerResponse() {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('WebRTC answer timeout'));
        }, 20000);

        if (!socket) {
            return reject(new Error('WebSocket is not connected'));
        }

        socket.onmessage = function (event) {
            try {
                const data = JSON.parse(event?.data);
                if (data.type === "ANSWER" && data.sdp) {
                    clearTimeout(timeout);
                    resolve(data.sdp);
                } else if (data.type === "ERROR") {
                    clearTimeout(timeout);
                    reject(new Error(data?.message || 'WebRTC connection error'));
                }
            } catch (error) {
                clearTimeout(timeout);
                reject(error);
            }
        };
    });
}

async function ws_WebRTCServer(offer, landlord_id = 1) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error('WebSocket is not connected');
    }
    socket.send(JSON.stringify({
        type: "OFFER",
        offer,
        landlord_id
    }));
}

async function ws_handleMouseControl(landlord_id = 1) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: "CONTROL", landlord_id }));
}

async function ws_disconnectConnection(uuid, landlord_id = 1) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: "DISCONNECT", uuid, landlord_id }));
}

async function webSocket(userToken = null, onDevices = null) {
    if (typeof window !== 'undefined') {
        window.addEventListener("beforeunload", () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        });
    }

    const token = getToken(userToken);
    const wsUrl = `${ADDRESS_URL.replace(/^http/, 'ws')}/v2/clients/ws?token=${token}`;
    
    try {
        socket = new WebSocket(wsUrl);
    } catch (e) {
        socket = new WebSocket(`${ADDRESS_URL.replace(/^http/, 'ws')}/v1/clients/ws?token=${token}`);
    }

    socket.onopen = function (event) {
        console.info("___Websocket connected:___", event.type);
    };

    socket.onmessage = function (event) {
        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case "WS_CONNECTION":
                    console.log("WebSocket session established:", data.message);
                    break;
                case "DEVICES":
                    console.log("Live devices updated:", data.devices);
                    if (onDevices && typeof onDevices === 'function') {
                        onDevices(data.devices || []);
                    }
                    break;
                case "CONTROL_ACK":
                    console.log("Got control acknowledgement:", data);
                    break;
                case "DISCONNECT_ACK":
                    console.log("Got disconnect acknowledgement:", data);
                    break;
                default:
                    break;
            }
        } catch (err) {
            console.error("Error handling incoming WebSocket message:", err);
        }
    };

    socket.onclose = function (event) {
        console.info("__Websocket closed:__", event.type);
    };
}

export {
    ws_WebRTCServer,
    GET_Computers,
    GET_identification,
    POST_locallandlord,
    webSocket,
    ws_handleMouseControl,
    ws_disconnectConnection,
    ws_WebRTCServerResponse
};