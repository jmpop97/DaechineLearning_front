token = localStorage.getItem("access")
const getArticles = async () => {
    const response = await fetch(`${back_base_url}/articles/`)
    const articleResult = document.querySelector("#articles")

    if (response.status == 200) {
        response_json = await response.json();
        articles = response_json
        // console.log("111111111")
        // console.log(articles)
        // console.log("222222222")
        let article_list = ``
        for (let i = 0; i < articles.length; i++) {
            article = articles[i]
            let user = article['user']
            let images = article['images']
            let title = article['title']
            let content = article['content']
            let genre = article['genre']
            let id = article['id']
            console.log(article)
            let music_id = article['music_id']
            let music_search = article['music_search']
            let created_at = article['created_at']
            let updated_at = article['updated_at']
            article_list += `
                <div class="col">
                    <div class="card h-100">
                        <img src="${images}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">제목 : ${title}</h5>
                            <p class="card-text">작성자 : ${user}.</p>
                            <p class="card-text">곡명 : ${music_id}.</p>
                            <p class="card-text">내용 : ${content}.</p>
                            <p class="card-text">장르 : ${genre}.</p>
                            <p class="card-text">작성일 : ${created_at}.</p>
                            <button onclick="getDetailArticles(${id})" type="button" class="btn btn-primary">상세보기</button>
                        </div>
                    </div>
                </div>`
        }
        articleResult.innerHTML = article_list
        return response_json;
    } else {
        alert(`${response.status} error`);
    }
}
const getDetailArticles = async (article_id) => {
    try {
        const response = await fetch(`${back_base_url}/articles/${article_id}`);
        if (!response.ok) {
            throw new Error('상세 정보를 불러오는데 실패했습니다.');
        }
        const articleDetail = await response.json();
        // 새로운 페이지 출력
        console.log("11111111111")
        console.log(articleDetail)
        console.log("22222222222")
        window.open(
            `../templates/articles_detail.html?images=${articleDetail.images}&id=${articleDetail.id}&title=${articleDetail.title}&name=${articleDetail.user}&content=${articleDetail.content}&music_id=${articleDetail.music_id}&genre=${articleDetail.genre}`,
            'articleDetailPage',
            'width=600,height=800'
        )
    } catch (error) {
        console.error(error.message);
        alert('게시글 상세 정보를 불러오는데 실패했습니다.');
    }
}

window.onload = () => {
    getArticles()
}