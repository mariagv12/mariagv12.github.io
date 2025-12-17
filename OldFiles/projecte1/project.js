
const viewport = document.getElementById('viewport');
const space = document.getElementById('space');
const items = Array.from(document.querySelectorAll('.item'));
const overlay = document.getElementById('overlay');
const overlayImg = document.getElementById('overlayImg');
const closeOverlay = document.getElementById('closeOverlay');

const initialPositions = {
  img1: { x: 200, y: 300 },
  img2: { x: 600, y: 150 },
  img3: { x: 1000, y: 400 },
 
};

// posició//
items.forEach(item => {
  const id = item.dataset.id;
  const pos = initialPositions[id] || {
    x: Math.random() * 2000,
    y: Math.random() * 2000
  };
  item.style.left = pos.x + 'px';
  item.style.top = pos.y + 'px';
  item.addEventListener('dragstart', e => e.preventDefault());
});

// per moures dintre del espai//
let activePointerId = null;
let pointerDownOnItem = false;
let draggingItem = null;
let pointerStartX = 0;
let pointerStartY = 0;
let itemStartX = 0;
let itemStartY = 0;
let moved = false;
const MOVE_THRESHOLD = 6;

let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let offsetX = 0;
let offsetY = 0;
let currentPanDX = 0;
let currentPanDY = 0;

function updateSpaceTransform(dx = 0, dy = 0) {
  space.style.transform = `translate(${offsetX + dx}px, ${offsetY + dy}px)`;
}


viewport.addEventListener('pointerdown', (e) => {
  if (activePointerId !== null) return;
  activePointerId = e.pointerId;
  viewport.setPointerCapture(activePointerId);

  pointerStartX = e.clientX;
  pointerStartY = e.clientY;
  moved = false;

  if (e.target.classList.contains('item')) {
    pointerDownOnItem = true;
    draggingItem = e.target;
    itemStartX = parseFloat(draggingItem.style.left) || 0;
    itemStartY = parseFloat(draggingItem.style.top) || 0;
    draggingItem.style.transition = 'none';
    draggingItem.style.zIndex = 1000;
  } else {
    isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    currentPanDX = 0;
    currentPanDY = 0;
    viewport.classList.add('dragging');
  }
});

viewport.addEventListener('pointermove', (e) => {
  if (activePointerId !== e.pointerId) return;

  const dx = e.clientX - pointerStartX;
  const dy = e.clientY - pointerStartY;

  if (pointerDownOnItem && draggingItem) {
    const newX = itemStartX + dx;
    const newY = itemStartY + dy;
    draggingItem.style.left = newX + 'px';
    draggingItem.style.top = newY + 'px';
    if (Math.hypot(dx, dy) > MOVE_THRESHOLD) moved = true;
  } else if (isPanning) {
    currentPanDX = dx;
    currentPanDY = dy;
    updateSpaceTransform(currentPanDX, currentPanDY);
    if (Math.hypot(dx, dy) > MOVE_THRESHOLD) moved = true;
  }
});

viewport.addEventListener('pointerup', (e) => {
  if (activePointerId !== e.pointerId) return;

  if (pointerDownOnItem && draggingItem) {
    draggingItem.style.transition = '';
    draggingItem.style.zIndex = '';

    const dxTotal = parseFloat(draggingItem.style.left) - itemStartX;
    const dyTotal = parseFloat(draggingItem.style.top) - itemStartY;
    const totalMoved = Math.hypot(dxTotal, dyTotal);

    if (totalMoved <= MOVE_THRESHOLD) {
      openOverlay(draggingItem.src, draggingItem.alt || '');
    }

    draggingItem = null;
    pointerDownOnItem = false;
  } else if (isPanning) {
    offsetX = offsetX + currentPanDX;
    offsetY = offsetY + currentPanDY;
    currentPanDX = 0;
    currentPanDY = 0;
    isPanning = false;
    viewport.classList.remove('dragging');
    updateSpaceTransform(0, 0);
  }

  try { viewport.releasePointerCapture(activePointerId); } catch {}
  activePointerId = null;
});

viewport.addEventListener('pointercancel', (e) => {
  if (activePointerId !== e.pointerId) return;
  if (pointerDownOnItem && draggingItem) {
    draggingItem.style.transition = '';
    draggingItem.style.zIndex = '';
    draggingItem = null;
    pointerDownOnItem = false;
  }
  if (isPanning) {
    offsetX = offsetX + currentPanDX;
    offsetY = offsetY + currentPanDY;
    currentPanDX = 0;
    currentPanDY = 0;
    isPanning = false;
    viewport.classList.remove('dragging');
    updateSpaceTransform(0, 0);
  }
  try { viewport.releasePointerCapture(activePointerId); } catch {}
  activePointerId = null;
});


function openOverlay(src, alt) {
  overlayImg.src = src;
  overlayImg.alt = alt || 'Imagen ampliada';
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden', 'false');

  const nombreArchivo = src.split('/').pop();

  let titulo = "";
  let titulo2 = "";
  let descripcion = "";
  let descripcion2 = "";
  let descripcion3 = "";
  
  

  if (nombreArchivo === "img1.png") {
    titulo = "Crema Catalana";
    titulo2 = "Catalan Cream";
    descripcion = "A traditional Catalan winter dish combining soup, vegetables, and meat. It’s the heart of Christmas meals in Catalonia.";
    descripcion2 = "Made with: beef shank, chicken, butifarra sausage, pork bones, pilota (meatball), chickpeas, cabbage, carrot, potato, leek, celery, turnip, galets pasta, salt, and olive oil.";
    descripcion3 = "Considered the oldest known Catalan stew. Every family has its own recipe — it’s a symbol of homemade comfort and holiday celebration.";
  } else if (nombreArchivo === "img2.png") {
    titulo = "Dish name 2";
    titulo2 = "Subtitle 2";
    descripcion = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    descripcion2 = "Vivamus blandit, justo at tincidunt dignissim, magna arcu fermentum sapien.";
    descripcion3 = "Vivamus blandit, justo at tincidunt dignissim, magna arcu fermentum sapien.";
    
  } else if (nombreArchivo === "img3.png") {
    titulo = "Dish name 3";
    titulo2 = "Subtitle 3";
    descripcion = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    descripcion2 = "Vivamus blandit, justo at tincidunt dignissim, magna arcu fermentum sapien.";
    descripcion3 = "Vivamus blandit, justo at tincidunt dignissim, magna arcu fermentum sapien.";
    
  }

  document.getElementById('Title').textContent = titulo;
  document.getElementById('Title2').textContent = titulo2;
  document.getElementById('Desc').textContent = descripcion;
  document.getElementById('Desc2').textContent = descripcion2;
  document.getElementById('Desc3').textContent = descripcion3;
  document.getElementById('Desc4').textContent = descripcion4;


  }

closeOverlay.addEventListener('click', () => {
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden', 'true');
  overlayImg.src = '';
   overlayImg.style.left = '';
  overlayImg.style.top = '';
  activePointerId = null;
});
overlay.addEventListener('pointerdown', (e) => {
  if (e.target === overlay) closeOverlay.click();
});
document.addEventListener('selectstart', (e) => {
  if (activePointerId !== null) e.preventDefault();
});




const filterBtn = document.getElementById('filterStarters');
let filtroActivo = false; 

if (filterBtn) {
  filterBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (filtroActivo) {
      document.body.classList.remove('filtrando');
      items.forEach(item => item.classList.remove('activa'));
      filterBtn.classList.remove('activo');
      filtroActivo = false;
      return;
    }

    document.body.classList.add('filtrando');
    filterBtn.classList.add('activo');
    filtroActivo = true;

    items.forEach(item => {
      if (item.classList.contains('starters')) {
        item.classList.add('activa');
      } else {
        item.classList.remove('activa');
      }
    });
  });
}

// añadir filtros


// Pantalla inicial: ocultar al hacer clic en la imagen
const introImage = document.getElementById("intro-image");
if (introImage) {
  introImage.addEventListener("click", () => {
    const intro = document.getElementById("intro-screen");
    intro.style.display = "none";
  });
}
// Al hacer clic en el logo del header, volver a la pantalla inicial
const headerLogo = document.querySelector("#main-header .header-logo");
if (headerLogo) {
  headerLogo.addEventListener("click", () => {
    const intro = document.getElementById("intro-screen");
    intro.style.display = "flex"; // vuelve a mostrar la pantalla inicial
  });
}
