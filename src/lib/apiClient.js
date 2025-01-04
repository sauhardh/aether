const ADDRESS_URL = "http://0.0.0.0:7878"

const TOKEN = ""

async function GET_Computers() {
    const res = await fetch(`${ADDRESS_URL}/api/authorized/computers`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${TOKEN}`
        }
    })
    const result = await res.json();
    //TODO
    console.log("Got from computers", result);
};

//It gets identification token for landlord to communicate with server
async function GET_identification() {
    const res = await fetch(`${ADDRESS_URL}/api/authorized/identification`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${TOKEN}`
        }
    })
    const result = await res.json();
    console.log("Got from identification", result)
    return result.message;
}

//It post identification token to the local landlord
async function POST_locallandlord(PORT, token_id) {
    console.log("port is ", PORT, token_id)
    const res = await fetch(`http://localhost:${PORT}/negotiate-server`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token: token_id
        })
    })
    const result = await res.json();
    return result;
}


let socket = null;
async function ws_WebRTCServerResponse() {

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('WebRTC answer timeout'));
        }, 20000); // 10 second timeout

        socket.onmessage = function (event) {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "ANSWER" && data.sdp) {
                    clearTimeout(timeout);
                    resolve(data.sdp);
                } else if (data.type === "ERROR") {
                    clearTimeout(timeout);
                    reject(new Error(data.message || 'WebRTC connection error'));
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
    await socket.send(JSON.stringify({
        type: "OFFER",
        offer,
        landlord_id
    }));
}

async function ws_handleMouseControl(landlord_id = 1) {
    await socket.send(JSON.stringify({ type: "CONTROL", landlord_id }))
}

async function ws_disconnectConnection(uuid, landlord_id) {
    await socket.send(JSON.stringify({ type: "DISCONNECT", uuid, landlord_id }))
}

async function webSocket() {

    window.addEventListener("beforeunload", () => {
        if (socket && socket.readyState == WebSocket.OPEN) {
            socket.close()
        }
    })

    socket = new WebSocket(`${ADDRESS_URL}/v1/clients/ws?token=${TOKEN}`);

    socket.onopen = function (event) {
        console.info("___Websocket:___", event.type);
    }

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);

        switch (data.type) {
            case "WS_CONNECTION":
                console.log(data.message)
                break
            case "DEVICES":
                console.log("Devices are ", data.devices)
                break
            case "ERROR":
                console.log("ERROR IS ", data)
                break
            case "CONTROL_ACK":
                console.log("got control ack", data)
                break
            case "DISCONNECT_ACK":
                console.log("got disconnect ack", data)
                break
        }
    }
    socket.onclose = function (event) {
        console.info("__Websocket:__", event.type);
    }

}

export { ws_WebRTCServer, GET_Computers, GET_identification, POST_locallandlord, webSocket, ws_handleMouseControl, ws_disconnectConnection, ws_WebRTCServerResponse }