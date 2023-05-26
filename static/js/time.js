async function endtime() {
    let token = localStorage.getItem("access")
    const formdata = new FormData();
    formdata.append("article", 1)
    formdata.append("listen_rate", 1)
    const response = await fetch(`http://127.0.0.1:8000/users/active/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formdata
    })
    const data = await response.json()
}

setTimeout('endtime()', 90000)//1분30초


