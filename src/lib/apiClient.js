const ADDRESS_URL = "http://0.0.0.0:7878"

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJqb2huX2RvZSIsImlhdCI6MTczNDkzMzQ2NywiZXhwIjoxNzM0OTM0MDY3fQ.hu9cKe8nxnanCHfr2SNyACEo4NWSZeDGFI9uHD5Zp2U"


async function POST_WebRTCServer(type, sdp) {

    const response = await fetch(`${ADDRESS_URL}/api/authorized/webrtc-offer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
            'type': type,
            'sdp': sdp
        })
    });
    return response
}

async function GET_Computers() {
    const res = await fetch(`${ADDRESS_URL}/api/authorized/computers`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${TOKEN}`
        }
    })
    const result = await res.json();
    console.log("Got from computers", result);
};


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

async function POST_locallandlord(PORT, token_id) {
    const res = await fetch(`http://localhost:${PORT}`, {
        method: "POST",
        body: JSON.stringify({
            'token': token_id
        })
    })

    const result = await res.json();
    console.log("Got something form landlord", result);
    return result;
}



export { POST_WebRTCServer, GET_Computers, GET_identification, POST_locallandlord }