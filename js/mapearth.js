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

window.onload = function() {
    const targets = {
        '2023 埼玉': { center: [139.7, 35.95], zoom: 3, contents: '<img src="img/phhasuda1.jpg">' },
        '2021 埼玉': { center: [139.7, 35.95], zoom: 3, contents: '<img src="img/ph21sai1.jpg">' },
        '2011 熊本 1': { center: [131, 33.05], zoom: 3, contents: '<img src="img/phkumamoto1.jpg">' },
        '2011 熊本 2': { center: [131, 33.05], zoom: 3, contents: '<img src="img/phkumamoto2.jpg">' },
        '2011 新竹': { center: [121, 25], zoom: 3, contents: '<img src="img/phtaiwan1.jpg">' },
        '2010 東京': { center: [139.17, 35.82], zoom: 3, contents: '<img src="img/phome1.jpg">' },
        '2010 Bangkok': { center: [100.5, 13.85], zoom: 3, contents: '<img src="img/ph10bangkok1.jpg">' },
        '2009 広東 1': { center: [113.2, 23.2], zoom: 3, contents: '<img src="img/phgz1.jpg">' },
        '2009 広東 2': { center: [112.2, 23.2], zoom: 3, contents: '<img src="img/phgd1.jpg">' },
        '2009 広東 3': { center: [112.2, 23.2], zoom: 3, contents: '<img src="img/ph09gd2.jpg">' },
        '2008 山梨': { center: [138.74, 35.37], zoom: 3, contents: '<img src="img/ph08fuji.jpg">' },
        '2005 Venezia': { center: [12.33, 45.43], zoom: 3, contents: '<img src="img/ph2005venezia1.jpg">' },
        '2005 Burano': { center: [12.42, 45.48], zoom: 3, contents: '<img src="img/ph2005burano1.jpg">' },
        '2005 Bologna': { center: [11.32, 44.51], zoom: 3, contents: '<img src="img/ph2005bologna1.jpg">' },
        '2005 Napoli': { center: [14.2, 41.1], zoom: 3, contents: '<img src="img/ph2005napoli1.jpg">' },
        '2005 Bari': { center: [16.82, 41.17], zoom: 3, contents: '<img src="img/ph2005bari1.jpg">' },
        '2005 Alberobello': { center: [17.24, 40.78], zoom: 3, contents: '<img src="img/ph2005alberobello1.jpg">' },
        '1999 群馬': { center: [138.535, 36.644], zoom: 3, contents: '<img src="img/ph99sirane1.jpg">' },
        '1993 Bali 1': { center: [115.4, -8.2], zoom: 3, contents: '<img src="img/ph93bali1.jpg">' },
        '1993 Bali 2': { center: [115.4, -8.2], zoom: 3, contents: '<img src="img/ph93bali2.jpg">' },
        '1992 Saipan': { center: [145.75, 15.24], zoom: 3, contents: '<img src="img/ph92saipan1.jpg">' },
        '1992 Istanbul 1': { center: [29.04, 41.2], zoom: 3, contents: '<img src="img/sh92istanbul1.jpg">' },
        '1992 Istanbul 2': { center: [29.0, 41.05], zoom: 3, contents: '<img src="img/sh92istanbul2.jpg">' },
        '1992 Istanbul 3': { center: [29.0, 41.05], zoom: 3, contents: '<img src="img/sh92istanbul3.jpg">' },
        '1992 Istanbul 4': { center: [29.0, 41.05], zoom: 3, contents: '<img src="img/sh92istanbul4.jpg">' },
        '1992 Istanbul 5': { center: [29.0, 41.05], zoom: 3, contents: '<img src="img/sh92istanbul5.jpg">' },
        '1992 Istanbul 6': { center: [29.0, 41.05], zoom: 3, contents: '<img src="img/sh92istanbul6.jpg">' },
        '1992 Istanbul 7': { center: [29.0, 41.05], zoom: 3, contents: '<img src="img/sh92istanbul7.jpg">' },
        '1992 Izmir': { center: [26.5, 38.7], zoom: 3, contents: '<img src="img/sh92izmir1.jpg">' },
        '1989 Ayutthaya': { center: [100.6, 14.5], zoom: 3, contents: '<img src="img/ph89ayutthaya1.jpg">' },
        '1989 Singapore': { center: [103.8, 1.28], zoom: 3, contents: '<img src="img/ph89singapore1.jpg">' },
        '1989 Melaka': { center: [102.2, 2.19], zoom: 3, contents: '<img src="img/ph89melaka1.jpg">' },
        '1988 D.C.': { center: [283, 39], zoom: 3, contents: '<img src="img/ph88dc1.jpg">' },
        '1988 Ontario': { center: [280.2, 43.2], zoom: 3, contents: '<img src="img/ph88ontario1.jpg">' },
        '1988 Arizona': { center: [247.8, 36.33], zoom: 3, contents: '<img src="img/ph88arizona1.jpg">' },
        '1987 Indiana': { center: [273.84, 39.83], zoom: 3, contents: '<img src="img/ph87indiana1.jpg">' },
        '1986 上海 1': { center: [121.5, 31.3], zoom: 3, contents: '<img src="img/ph86shanghai1.jpg">' },
        '1986 上海 2': { center: [121.5, 31.3], zoom: 3, contents: '<img src="img/ph86shanghai2.jpg">' },
        '1986 陝西': { center: [108.93, 34.22], zoom: 3, contents: '<img src="img/ph86xian1.jpg">' },
    }
    const start = Math.floor(Math.random() * Object.keys(targets).length);
    const yview = (window.matchMedia && window.matchMedia('(max-device-width: 700px)').matches) ? 10: 15;
    //build_earth(targets, start, yview);
    build_earth(targets, start, yview);
}