let token = localStorage.getItem("access")

// 현재 로그인 유저
let payload = localStorage.getItem("payload");
let payload_parse = JSON.parse(payload);
let current_user = payload_parse.username;
console.log(payload, payload_parse, current_user)

// 이메일 유효성 검사
function CheckEmail(str) {
    var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!reg_email.test(str)) {
        return false;
    } else {
        return true;
    }
}

// 회원가입
async function handleSignin() {
    // try {
    const email = document.getElementById("email").value
    const email_ = document.getElementById("email")
    const username = document.getElementById("username").value
    const password1 = document.getElementById("password1").value
    const password2 = document.getElementById("password2").value
    console.log(email_, email, username, password1, password2)

    if (password2 !== password1) {
        alert("비번 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    } else if (!email || !username || !password1 || !password2) {
        alert("공란 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    } else if (!CheckEmail(email)) { // 존재한다면 -1이 아닌 숫자가 반환됨
        alert("이메일 형식이 아닙니다.");
        email_.focus();
        console.log(email_)
        return false;
    }
    // userID(e-mail) 가입여부 검사
    // $("#checkid").click(function (e) {
    //     e.preventDefault();
    //     var email = $("input[name='email']");
    //     if (email.val() == '') {
    //         alert('이메일을 입력하세요');
    //         email.focus();
    //         return false;
    //     } else {
    //         var emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    //         if (!emailRegex.test(email.val())) {
    //             alert('이메일 주소가 유효하지 않습니다. ex)abc@gmail.com');
    //             email.focus();
    //             return false;
    //         }
    //     }

    //     $.ajax({
    //         url: 'a.joinChk.php',
    //         type: 'POST',
    //         data: { userID: email.val() },
    //         dataType: "json",
    //         success: function (msg) {
    //             //alert(msg); // 확인하고 싶으면 dataType: "text" 로 변경한 후 확인 가능
    //             if (msg.result == 1) {
    //                 alert('사용 가능합니다');
    //             } else if (msg.result == 0) {
    //                 alert('이미 가입된 아이디입니다');
    //                 email.val('');
    //             }
    //         },
    //         error: function (jqXHR, textStatus, errorThrown) {
    //             alert("arjax error : " + textStatus + "\n" + errorThrown);
    //         }
    //     });
    // });

    const response = await fetch(`${back_base_url}/users/dj-rest-auth/registration/`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "username": username,
            "password1": password1,
            "password2": password2
        })

    })
    console.log(response)

    if (response.status == 201) {
        alert("이메일을 확인해주세요.")
        window.location.reload()
    } else {
        console.error()
        // alert(error)
        alert("이미가입된 유저입니다.")
        alert(response.status)
        window.location.reload()
    }
    // } catch (err) {
    //     errorText.innerHTML = '에러메시지 : ' + err;
    // }
    // } catch (error) {
    //     error.text().then(msg => alert(msg))
    //     // alert(error.msg)
    //     alert("이미가입된 유저입니다.")
    // }
}

// 이메일 인증 재전송
async function handleEmailValify() {
    const email = document.getElementById("email").value
    console.log(email)

    const response = await fetch(`${back_base_url}/users/dj-rest-auth/registration/resend-email/`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
        })
    })
    console.log(response)
    if (response.status == 200) {
        alert("이메일을 확인해주세요.")
        window.location.replace(`${front_base_url}/templates/login.html`)
    } else {
        // console.error(error.msg)
        // alert(error)
        alert("가입되지 않은 이메일입니다. 다시확인해주세요.")
        alert(response.status)
    }

}

// 로그인
async function handleLogin() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    console.log(username, password)

    const response = await fetch(`${back_base_url}/users/dj-rest-auth/login/`, {
        headers: {
            "Content-Type": "application/json",

        },
        method: 'POST',
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })

    const response_json = await response.json()

    console.log(response_json)

    localStorage.setItem("access", response_json.access);
    localStorage.setItem("refresh", response_json.refresh);

    if (response.status == 200) {
        alert("로그인되었습니다.")
        window.location.replace(`${front_base_url}/index.html`)
    } else {
        alert("이메일 인증먼저해주세요!")
        alert(response.status)
        window.location.replace(`${front_base_url}/templates/login.html`)
    }


    // 코드스니펫에는 accessToken.split -> response_json.access(이걸로 변경해야함  Token없다고 에러)
    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    localStorage.setItem("payload", jsonPayload);


}

// 로그아웃
async function handleLogout() {
    const response = await fetch(`${back_base_url}/users/dj-rest-auth/logout/`, {
        headers: {
            // ${ back_base_url }
            'Authorization': `Bearer ${token}`,
            // 'Access-Control-Allow-Credentials': 'true'
        },
        method: 'POST',
    })
    alert("로그아웃!")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.reload();
    console.log(response)
}

// 비번변경-로그인된 상태에서
async function pschange() {
    const password1 = document.getElementById("password1").value
    const password2 = document.getElementById("password2").value
    console.log(password1, password2)

    if (password2 !== password1) {
        alert("비번 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    } else if (!password1 || !password2) {
        alert("공란 잘못된입력입니다. 확인해주세요.")
        window.location.reload()
    }

    const response = await fetch(`${back_base_url}/users/dj-rest-auth/password/change/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",

        },
        method: 'POST',
        body: JSON.stringify({
            "password1": password1,
            "password2": password2
        })
    })
    alert("비밀번호가 변경되었습니다.")
    window.location.replace(`${front_base_url}/index.html`)
    console.log(response)
}

window.onload = () => {
    console.log("회원가입, 로그인 api")

}