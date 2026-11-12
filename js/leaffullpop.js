
function leaffullpop(map, spots) {
  const modal = document.getElementById('fullscreen-modal');
  const closeBtn = document.getElementById('close-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalImages = document.getElementById('modal-images'); // コンテナを取得
  const modalDesc = document.getElementById('modal-desc');
  const ir = 13;
  const id = ir + ir;
  var myicon1 = L.icon({iconUrl: 'img/marker100red.png', iconSize:[id,id], iconAnchor:[ir,id], popupAnchor:[0,-id]});

  spots.forEach(spot => {
    const marker = L.marker(spot.latlng, {icon:myicon1}).addTo(map);
    marker.bindTooltip(spot.name);

    marker.on('click', () => {
      modalTitle.textContent = spot.name;
      // modalDesc.textContent = spot.description;
      modalDesc.innerHTML = spot.description;
      modalImages.innerHTML = '';

      spot.images.forEach((imgUrl, index) => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = `${spot.name}の写真${index + 1}`;
        img.className = 'modal-img'; // CSSのスタイルを適用
        modalImages.appendChild(img);
      });

      modal.classList.remove('hidden');
      modal.querySelector('.modal-content').scrollTop = 0;
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // モーダルの黒い背景部分をクリックした時
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // キーボードの「Esc」キーを押した時
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
    }
  });
}
