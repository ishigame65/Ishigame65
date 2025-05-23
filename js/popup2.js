/* https://qiita.com/yuaomo/items/55ec1c3ae15ffb272f9c
【JavaScript】クリックしたときにポップアップを表示する
見つけた中ではかなりシンプルな実装
*/
const clickBase = document.getElementById('popup-base');
const popupWrapper = document.getElementById('popup-wrapper');
const close = document.getElementById('close');

// 2025 moriuchi
const inside = document.getElementById('popup-inside');
const text = document.getElementById('popup-text');
const pics = document.getElementById('popup-pics');
const marker = document.getElementById('popup-marker');

// ボタンをクリックしたときにポップアップを表示させる
clickBase.addEventListener('click', () => {
    popupWrapper.style.display = "block";
});

// ポップアップの外側又は「x」のマークをクリックしたときポップアップを閉じる
popupWrapper.addEventListener('click', e => {
    if (e.target.id === popupWrapper.id || e.target.id === close.id) {
        popupWrapper.style.display = 'none';
    }
});

// 2025 moriuchi
// aタグのonclickでポップアップを表示させる
function popup() {
    popupWrapper.style.display = "block";
}
function mapup(lng, x, y, txt) {
    popupWrapper.style.display = "block";
    text.innerHTML = txt;
    pics.src = "img/cmap" + lng +"s400.png";
    let nx = x + 117;
    let ny = y + 110;
    marker.style.left = nx + "px";  // px付与必須
    marker.style.top =  ny + "px";
}
