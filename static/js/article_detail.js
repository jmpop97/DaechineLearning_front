// 상단 로그아웃
function handleLogout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("payload");
  window.location.replace(`${front_base_url}/templates/articles.html`);
}
// 페이지 로드, 게시글이랑 댓글 가져오기
window.onload = async function () {
  // 상단바 (from homa.js)
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload);
  if (payload_parse != null) {
    dropdown_item_1 = document.getElementById("dropdown_item_1");
    dropdown_item_2 = document.getElementById("dropdown_item_2");
    dropdown_item_3 = document.getElementById("dropdown_item_3");
    dropdown_item_1.style.display = "none";
    dropdown_item_2.style.display = "none";
    dropdown_item_3.style.display = "none";

    const nav_response = await fetch(
      `${back_base_url}/${API_USERS}/article_main/${payload_parse.user_id}`
    );
    const nav_response_json = await nav_response.json();

    dropdown_menu = document.getElementById("dropdown_toggle");
    dropdown_menu.innerText = nav_response_json.username;

    nav_profile_image = document.getElementById("nav_profile_image");
    if (nav_response_json.image != null) {
      nav_profile_image.setAttribute(
        "src",
        `${back_base_url}${nav_response_json.image}`
      );
    }
  } else {
    dropdown_item_3 = document.getElementById("dropdown_item_3");
    dropdown_item_4 = document.getElementById("dropdown_item_4");
    dropdown_item_5 = document.getElementById("dropdown_item_5");
    dropdown_item_8 = document.getElementById("dropdown_item_8");
    dropdown_item_3.style.display = "none";
    dropdown_item_4.style.display = "none";
    dropdown_item_5.style.display = "none";
    dropdown_item_8.style.display = "none";
  }
};
