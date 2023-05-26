async function emoticonCreate() {
    const access = localStorage.getItem("access");

    const emoticonTitle = document.getElementById('title').value
    const emoticonImage = document.getElementById('image').files

    const formData = new FormData();

    formData.append('title', emoticonTitle)
    for (let i = 0; i < emoticonImage.length; i++) {
        formData.append("images", emoticonImage[i]);
    }

    const response = await fetch(`${back_base_url}/comments/emoticon/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    console.log(data);

    if (response.status == 200) {
        if (confirm("등록 완료!\n계속 등록 하시겠습니까?")) {
            return false;
        } else {
            window.location.href = "../";
        }
    } else {
        alert("잘못 된 요청입니다.");
    }
}
