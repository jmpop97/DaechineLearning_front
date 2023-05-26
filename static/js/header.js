let header = `
<header class="d-flex justify-content-between align-items-center" style="height: 4rem;">
    <nav>
    <a href="/index.html" class="btn btn-primary">홈</a>
        <a href="/templates/emoticon_list.html" class="btn btn-primary">이모티콘 리스트 보기</a>
        <a href="/templates/emoticon_create.html" class="btn btn-primary">이모티콘 만들기</a>
        <a href="/templates/music_search.html" class="btn btn-primary">음악검색</a>
    </nav>
    <div class="sign d-flex justify-content-between align-items-center">
    <nav>
        <a href="/templates/login.html" class="btn btn-primary">로그인페이지로 이동</a>
        <a href="/templates/signup.html" class="btn btn-primary">회원가입페이지로 이동</a>
        <a href="javascript:void(0);" onclick="handleLogout()" class="btn btn-primary">로그아웃</a>
    </nav><!-- e:sign -->
        </header>
        <main>
        </main>
        <button type="button" onclick="location.href=${front_base_url}/templates/comment.html?article_id=1">1번 게시글 댓글로
            이동</button>
`

document.body.insertAdjacentHTML('afterbegin', header);
