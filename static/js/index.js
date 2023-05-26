console.log("js 연결")

// 로그인한 사용자의 토큰을 저장하고 있는지 확인
const token = localStorage.getItem("access");
const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload)


