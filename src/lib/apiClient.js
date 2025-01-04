const ADDRESS_URL = "http://0.0.0.0:7878"

const TOKEN = ""


async function GET_Computers() {
    try {
        const res = await fetch(`${ADDRESS_URL}/api/authorized/computers`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${TOKEN}`
            }
        })
        if (!res.ok) {
            throw new Error("Could not get the computers from server")
        }
        const result = await res.json();
        //TODO
        console.log("Got from computers", result);

    } catch (error) {
        console.error('error occured at get computers', error);
        return;
    }
};

//It gets identification token for landlord to communicate with server
async function GET_identification() {

    try {

        const res = await fetch(`${ADDRESS_URL}/api/authorized/identification`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${TOKEN}`
            }
        })
        if (!res.ok) {
            throw new Error("Could not get the token from server")
        }
        const result = await res.json();
        console.log("Got from identification", result)
        return result.message;
    } catch (error) {
        console.error("Error occured on getting identification token", error)
        return;
    }
}

//It post identification token to the local landlord
async function POST_locallandlord(PORT, token_id) {
    try {
        const res = await fetch(`http://localhost:${PORT}/negotiate-server`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: token_id
            })
        })
        if (!res.ok) {
            throw new Error("Could not post to your landlord");
        }
    } catch (error) {
        console.error("Error occured on post_landlord", error)
        return;
    }
}


let socket = null;
async function ws_WebRTCServerResponse() {

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('WebRTC answer timeout'));
        }, 20000); // 10 second timeout

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
    await socket.send(JSON.stringify({
        type: "OFFER",
        offer,
        landlord_id
    }));
}

async function ws_handleMouseControl(landlord_id = 1) {
    await socket.send(JSON.stringify({ type: "CONTROL", landlord_id }))
}

async function ws_disconnectConnection(uuid, landlord_id = 1) {
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