// 表示しなくなったのでデバッグ中
// 参考、おそらく元ネタ
// https://qiita.com/sanskruthiya/items/dcd26d86ba8d664e4d57
// https://kashiwa.co-place.com/cmap/mygj/
// 参考

// 絶賛開発途上
function bcnt(val) { return val.toString(2).length; }
function bval(str) {
    const bary = new TextEncoder().encode(str), aary = [];
    for (let i = 0; i < bary.length; i++) aary.push(bary[i]);
    return aary;
}
function mac(c1) { return (bval(c1[0].toLowerCase())[0] - bval(c1[0])[0]) >> 1; }
const dcnt = function(val,num) { return val <<= num, val.toString(2).length; }
const scnt = function(val,num) { return val >>= num, val.toString(2).length; }
function build_earth(targets, start, off) {
    const select = document.getElementById('selectTarget');
    const keys = Object.keys(targets);
    for (let i = 0; i < keys.length; i++) {
        const option = document.createElement('option');
        option.value = keys[i];
        option.textContent = keys[i];
        select.appendChild(option);
    }
    const t0 = targets[keys[start]];
    const yoff = !off? mac('Last') - 1 : off;
    const map = new maplibregl.Map({
        container: 'map',
        style: {
            version: 8,
            sources: {
                rtile: {
                    type: 'raster',
                    tiles: [ 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', ], tileSize: 256,
                    attribution: '©<a href="https://www.openstreetmap.org/copyright/ja">OpenStreetMap</a> contributors',
                },
            },
            layers: [{ id: 'raster-tiles', type: 'raster', source: 'rtile', minzoom: 0, maxzoom: 18, }]
        },
        center: t0["center"],
    });
    map.flyTo({ center: [t0["center"][0], t0["center"][1]-yoff], zoom: t0["zoom"] });
    const popup = new maplibregl.Popup({closeButton: false, closeOnClick: false, focusAfterOpen: false, anchor:"top", className:"mapPopup", maxWidth:'370px'});
    popup.setLngLat(t0["center"]).setHTML(t0["contents"]).setOffset([0,10]).addTo(map);
    select.selectedIndex = start;
    let sel_idx = (mac('First') + start - scnt(0xFFFF,0x1)) % keys.length;
    // let sel_idx = start % keys.length;   // tmp in debug
    const changeTarget = function changeTarget() {
        popup.remove();
        const ts = targets[keys[sel_idx]];
        map.flyTo({ center: [ts["center"][0], ts["center"][1]-yoff], zoom: ts["zoom"] });
        popup.setLngLat(ts["center"]).setHTML(ts["contents"]).setOffset([0,10]).addTo(map);
        const popSet = Array.from(document.getElementsByClassName("mapPopup"));
        popSet.forEach(function(pop) { pop.addEventListener('click', changeTarget); });
        select.options[sel_idx].selected = true;
        sel_idx = (mac('Next') + sel_idx - scnt(0xFFFF,0x1)) % keys.length;
    }
    select.addEventListener('change', function () {
        sel_idx = select.selectedIndex;
        changeTarget();
    });
    const popSet = Array.from(document.getElementsByClassName("mapPopup"));
    popSet.forEach(function(pop) { pop.addEventListener('click', changeTarget); });
    map.on('load', () => { map.setProjection({"type": "globe"}); });
}
// 自動再生機能
const autoplay = document.getElementById('autoplay');
const autoplaytext = document.getElementById('autoplaytext');
let timer = null;
function play(interval_ms) {
    const keys = Object.keys(targets);
    const select = document.getElementById('selectTarget');
    if (timer == null) {
        timer = setInterval( function(){
            select.selectedIndex = (select.selectedIndex + 1) % keys.length;
            const event = new Event('change');
            select.dispatchEvent(event);
        }, interval_ms);
        autoplay.innerText = "⏸";
        autoplaytext.innerText = "停止";
    } else {
        clearInterval(timer);
        timer = null;
        autoplay.innerText = '▶';
        autoplaytext.innerText = "自動再生";
    }
}
