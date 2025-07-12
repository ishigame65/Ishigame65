
function style_fixed100_(elem) {
    elem.style.position = 'absolute';
    elem.style.top = '0';
    elem.style.left = '0';
    elem.style.width = '100vw';
    elem.style.height = `${document.body.clientHeight}px`;
}

function style_random_(elem, rect, szset, white_ratio) {
    const szidx = Math.floor(Math.random() * 3);
    const sz = szset[szidx];
    const szmax = sz * Math.sqrt(2);
    const px = Math.floor(Math.random() * (rect.width - szmax));
    const py = Math.floor(Math.random() * (rect.height - szmax));
    const rotang = Math.floor(Math.random() * 360);
    elem.style.position = 'absolute';
    elem.style.width = `${sz}px`;
    elem.style.height = `${sz}px`;
    elem.style.backgroundRepeat = 'no-repeat';
    elem.style.backgroundSize = `contain`;
    elem.style.left = `${px}px`;
    elem.style.top = `${py}px`;
    elem.style.transform = `rotate(${rotang}deg)`;
    elem.style.opacity = `${1 - white_ratio}`;
}

function collage(base_num, pic_num, white_ratio) {
    const bg_collage = document.createElement('div');
    bg_collage.id = 'bg_collage';
    style_fixed100_(bg_collage);
    bg_collage.style.zIndex = '-2';
    document.body.appendChild(bg_collage);
    const base_sz = [ 512, 768, 896 ];
    const pic_sz = [ 192, 256, 384 ];
    const bg_rect = bg_collage.getBoundingClientRect();
    for (let n = 1; n <= base_num; n++) {
        const img = document.createElement('div');
        img.id = `b${n}`;
        img.style.backgroundImage = `url("img/bliub${n}.jpg")`;
        style_random_(img, bg_rect, base_sz, white_ratio);
        img.style.filter = 'grayscale(100%)';
        bg_collage.appendChild(img);
    }
    for (let n = 1; n <= pic_num; n++) {
        const img = document.createElement('div');
        img.id = `f${n}`;
        img.style.backgroundImage = `url("img/bliuf${n}.jpg")`;
        style_random_(img, bg_rect, pic_sz, white_ratio);
        bg_collage.appendChild(img);
    }
}
