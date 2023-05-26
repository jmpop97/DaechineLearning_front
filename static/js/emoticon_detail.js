const urlParams = new URLSearchParams(window.location.search);
const emoticonId = urlParams.get("emoticon_id");

const userId = JSON.parse(localStorage.getItem("payload")).user_id;

// 이모티콘 가져오기
async function getEmoticon(emoticon_id) {
    const response = await fetch(`${back_base_url}/comments/emoticon/detail/${emoticon_id}/`);

    if (response.status == 200) {
        response_json = await response.json();
        return response_json;
    } else {
        alert(response.status);
    }
}

// 유저가 가진 이모티콘들 가져오기
async function getUserEmoticon(user_id) {
    const access = localStorage.getItem("access");

    const response = await fetch(`${back_base_url}/comments/emoticon/${user_id}`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "GET",
    });

    if (response.status == 200) {
        response_json = await response.json();
        return response_json;
    } else {
        alert(response.status);
    }
}

// 이모티콘 삭제
async function emoticonDelete(emoticon_id) {
    const access = localStorage.getItem("access");

    if (confirm("삭제하시겠습니까?")) {
        const response = await fetch(
            `${back_base_url}/comments/emoticon/detail/${emoticon_id}/`,
            {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                method: "DELETE",
            }
        );
        if (response.status == 204) {
            alert("삭제되었습니다.");
            window.location.href = `${front_base_url}/templates/emoticon_list.html`
        } else {
            alert("권한이 없습니다!");
        }
    } else {
        // 취소 버튼을 눌렀을 경우
        return false;
    }
}

// 이모티콘 수정
async function emoticonUpdate(emoticon_id) {
    console.log('수정', emoticon_id)

    let emoticons = document.getElementById('images')
    let emoticonImages = emoticons.childNodes

    let emoticonTitle = document.getElementById('title')
    let titleValue = emoticonTitle.innerText
    emoticonTitle.innerText = ''
    let titleInput = document.createElement('input')
    titleInput.setAttribute('id', 'title_input')
    titleInput.placeholder = titleValue
    emoticonTitle.appendChild(titleInput)


    // 이모티콘 누르면 제거
    const removeImages = document.getElementById('remove_images') //제거할 리스트
    emoticonImages.forEach(element => {
        element.addEventListener('click', function () {
            const num = document.createElement('div')
            num.className = element.alt
            removeImages.appendChild(num)
            element.remove()
        })
    });

    const imageInput = document.getElementById('image_input')
    const updateImageInput = document.createElement('input')
    updateImageInput.setAttribute('type', 'file')
    updateImageInput.setAttribute('id', 'image')
    updateImageInput.setAttribute('multiple', 'true')
    const updateImageLabel = document.createElement('label')
    updateImageLabel.innerText = '추가할 이미지 : '
    updateImageLabel.setAttribute('class', 'mb-3')
    imageInput.appendChild(updateImageLabel)
    imageInput.appendChild(updateImageInput)


    let updateConfirmButton = document.getElementById('update_button')
    updateConfirmButton.setAttribute('onclick', `emoticonUpdateConfirm(${emoticon_id})`)

    let cancelConfirmButton = document.getElementById('delete_button')
    cancelConfirmButton.setAttribute('onclick', 'location.reload()')
    cancelConfirmButton.innerText = '취소'


}

// 수정 확인
async function emoticonUpdateConfirm(emoticon_id) {
    const access = localStorage.getItem("access");
    // 제거할 이미지 선택
    const removeImages = document.getElementById('remove_images').childNodes
    console.log(removeImages)
    const removeImagesList = []
    removeImages.forEach(element => {
        removeImagesList.push(element.className)
    });
    console.log(removeImagesList)
    // 제목 수정
    let title = document.getElementById('title_input').value
    if (title == '') {
        title = document.getElementById('title_input').placeholder
    }
    // 이미지 추가
    const addImages = document.getElementById('image').files

    const formData = new FormData()

    formData.append("title", title)
    formData.append("remove_images", removeImagesList)
    for (let i = 0; i < addImages.length; i++) {
        formData.append("images", addImages[i]);
    }

    const response = await fetch(`${back_base_url}/comments/emoticon/detail/${emoticon_id}/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: "PUT",
        body: formData,
    });
    const data = await response.json();
    console.log(data);

    if (response.status == 200) {
        alert("수정 완료!");
        window.location.href = `${front_base_url}/templates/emoticon_detail.html?emoticon_id=${emoticon_id}`;
    } else {
        alert("잘못 된 요청입니다.");
    }
}

// 유저 사용가능 저장
async function emoticonSelect(emoticon_id) {
    const access = localStorage.getItem("access");

    console.log('클릭')
    const select = document.getElementById('select_input').checked
    console.log(select)

    let requestMethod = ''
    if (select == true) {
        console.log('트루')
        requestMethod = "POST"
    } else {
        console.log('거짓')
        requestMethod = "DELETE"
    }
    console.log(requestMethod)
    
    const formData = new FormData();

    // formData.append('buyer', userId)
    formData.append('emoticon', emoticon_id)

    const response = await fetch(`${back_base_url}/comments/emoticon/${userId}/`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
        method: requestMethod,
        body: formData,
    });

    if (response.status == 200) {
        alert("사용 이모티콘에 추가했습니다")
    } else if (response.status == 204) {
        alert("사용 이모티콘에서 제외했습니다")
    } else {
        alert("잘못 된 요청입니다.");
    }
}

window.onload = async function () {
    const response = await getEmoticon(emoticonId)
    console.log(response)

    const emoticonTitle = document.getElementById('title')
    emoticonTitle.innerText = response.title

    const emoticonImages = document.getElementById('images')
    response.images.forEach(element => {
        const emoticonImage = document.createElement('img')
        emoticonImage.src = `${back_base_url}${element.image}`
        emoticonImage.setAttribute('alt', `${element.id}`)
        emoticonImage.setAttribute('style', 'width: 100px')
        emoticonImages.appendChild(emoticonImage)
    });

    const parentsDiv = document.getElementById('parents')

    const updateButton = document.createElement('button')
    updateButton.innerText = '수정'
    updateButton.setAttribute('onclick', `emoticonUpdate(${emoticonId})`)
    updateButton.setAttribute('id', 'update_button')
    parentsDiv.appendChild(updateButton)

    const deleteButton = document.createElement('button')
    deleteButton.innerText = '삭제'
    deleteButton.setAttribute('onclick', `emoticonDelete(${emoticonId})`)
    deleteButton.setAttribute('id', 'delete_button')
    parentsDiv.appendChild(deleteButton)


    const userEmoticon = await getUserEmoticon(userId)
    console.log(userEmoticon)
    const selectInput = document.createElement('input')
    selectInput.innerText = '사용하기'
    selectInput.setAttribute('id', 'select_input')
    selectInput.setAttribute('value', 'True')
    selectInput.setAttribute('type', 'checkbox')

    const idList = userEmoticon.map(obj => obj.id);
    if (idList.includes(parseInt(emoticonId))) {
        selectInput.setAttribute('checked', 'True')
    }
    selectInput.addEventListener('click', function () {
        emoticonSelect(emoticonId)
    })
    parentsDiv.appendChild(selectInput)
}
