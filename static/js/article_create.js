// 게시글작성 api FormData

async function articleCreate() {
  const articleTitle = document.getElementById("title").value;
  const articleContent = document.getElementById("content").value;
  const formdata = new FormData();

  formdata.append("title", articleTitle);
  formdata.append("content", articleContent);

  const response = await fetch(`${back_base_url}/article_detail/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`, // jwt token for login user
    },
    body: formdata,
  });

  if (response.status == 200) {
    alert("작성완료");
    window.location.replace(`${front_base_url}/templates/article_create.html`);
  } else {
    alert(response.status);
  }
}

function showFileName() {
  const input = document.getElementById("image");
  const fileName = document.getElementById("file-name");
  fileName.textContent = input.files[0].name;
}

// path('', views.ArticleView.as_view(), name='article_main'),
// path('<int:article_id>/', views.ArticleDetailView.as_view(), name='article_detail'),  # 특정 게시글 불러와, 수정, 삭제(GET,PUT,DEL)
