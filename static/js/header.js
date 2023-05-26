let header = `
<header class="d-flex justify-content-between align-items-center" style="height: 4rem;">
    <nav>
        <a href="/templates/emoticon_list.html" class="btn btn-primary">이모티콘 리스트 보기</a>
        <a href="/templates/emoticon_create.html" class="btn btn-primary">이모티콘 만들기</a>
        <a href="/templates/music_search.html" class="btn btn-primary">음악검색</a>
    </nav>
    <div class="sign d-flex justify-content-between align-items-center">
        <button class="btn btn-secondary" type="button"
            onclick="location.href=${front_base_url}/templates/login.html">로그인페이지로 이동</button>
        <button class="btn btn-secondary ms-3" type="button"
            onclick="location.href=${front_base_url} /templates/signup.html">회원가입페이지로 이동</button>
        <button class="btn btn-secondary ms-3 me-3" type="button" onclick="handleLogout()">로그아웃</button><br><br>
        </div><!-- e:sign -->
        </header>
        <main>
        </main>
        <button type="button" onclick="location.href=${front_base_url}/templates/comment.html?article_id=1">1번 게시글 댓글로
            이동</button>
`

document.body.insertAdjacentHTML('afterbegin', header);
