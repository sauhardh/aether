const ADDRESS_URL = "http://0.0.0.0:7878"

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJqb2huX2RvZSIsImlhdCI6MTczNDc5NTA2MywiZXhwIjoxNzM0Nzk1NjYzfQ.7lvsTyaVLZB38w9feelsPHAEFeFODPDU6j0PLH2AmSs"




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
    console.log("result is ", result);
};

export { POST_WebRTCServer, GET_Computers }