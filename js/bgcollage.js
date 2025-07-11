
function style_fixed100_(elem) {
    elem.style.position = 'fixed';
    elem.style.top = '0';
    elem.style.left = '0';
    elem.style.width = '100vw';
    elem.style.height = '100vh';
}

function style_random_(elem, rect, szset) {
    const px = Math.floor(Math.random() * (rect.width - 384));
    const py = Math.floor(Math.random() * (rect.height - 384));
    const szidx = Math.floor(Math.random() * 3);
    const rotang = Math.floor(Math.random() * 360);
    elem.style.position = 'fixed';
    elem.style.left = `${px}px`;
    elem.style.top = `${py}px`;
    elem.style.width = `${szset[szidx]}px`;
    elem.style.transform = `rotate(${rotang}deg)`;
}

function collage(base_num, pic_num, white_ratio) {
    const bg_collage = document.createElement('div');
    bg_collage.id = 'bg_collage';
    style_fixed100_(bg_collage);
    bg_collage.style.zIndex = '-2';
    const bg_cover = document.createElement('div');
    bg_cover.id = 'bg_cover';
    style_fixed100_(bg_cover);
    bg_cover.style.zIndex = '-1';
    // bg_cover.style.backgroundColor = 'rgba(255,255,245,0.85)';
    bg_cover.style.backgroundColor = `rgba(245,245,255,${white_ratio})`;
    document.body.appendChild(bg_collage);
    document.body.appendChild(bg_cover);
    const base_sz = [ 384, 512, 768 ];
    const pic_sz = [ 128, 192, 256 ];
    const bg_rect = bg_collage.getBoundingClientRect();
    for (let n = 1; n <= base_num; n++) {
        const img = document.createElement('img');
        img.src = `img/bliub${n}.jpg`;
        img.id = `b${n}`;
        style_random_(img, bg_rect, base_sz);
        img.style.filter = 'grayscale(100%)';
        bg_collage.appendChild(img);
    }
    for (let n = 1; n <= pic_num; n++) {
        const img = document.createElement('img');
        img.src = `img/bliuf${n}.jpg`;
        img.id = `f${n}`;
        style_random_(img, bg_rect, pic_sz);
        bg_collage.appendChild(img);
    }
}
// collage(6, 18, 0.85);    // base_num, pic_num
