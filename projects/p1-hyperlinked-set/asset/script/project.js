const viewport = document.getElementById('viewport');
const space = document.getElementById('space');
const items = Array.from(document.querySelectorAll('.item'));
const overlay = document.getElementById('overlay');
const overlayImg = document.getElementById('overlayImg');
const closeOverlay = document.getElementById('closeOverlay');

const initialPositions = {
  img1: { x: 423, y: 361 },
  img2: { x: 2564, y: 351 },
  img3: { x: 2528, y: 930 },
  img4: { x: 1328, y: 930 },
  img5: { x: 995, y: 286 },
  img6: { x: 1385, y: 552 },
  img7: { x: 2184, y: 615 },
  img8: { x: 788, y: 690 },
  img9: { x: 348, y: 930 },
  img10: { x: 1879, y: 287 },
  img11: { x: 1835, y: 892 }
};

items.forEach(item => {
  const id = item.dataset.id;
  const maxX = space.clientWidth - item.offsetWidth;
  const maxY = space.clientHeight - item.offsetHeight;
  
  let pos = initialPositions[id] || {
    x: Math.random() * maxX,
    y: Math.random() * maxY
  };

  item.style.left = pos.x + 'px';
  item.style.top = pos.y + 'px';
  item.addEventListener('dragstart', e => e.preventDefault());
});

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
let currentPanDX = 0;
let currentPanDY = 0;
const viewportW = viewport.clientWidth;
const viewportH = viewport.clientHeight;
const spaceW = space.clientWidth;
const spaceH = space.clientHeight;
let offsetX = (viewportW - spaceW) / 2;
let offsetY = (viewportH - spaceH) / 2;
space.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

function updateSpaceTransform(dx = 0, dy = 0) {
  let newX = offsetX + dx;
  let newY = offsetY + dy;
  
  const minX = viewport.clientWidth - space.clientWidth;
  const minY = viewport.clientHeight - space.clientHeight;
  
  if (newX > 0) newX = 0;
  if (newX < minX) newX = minX;
  if (newY > 0) newY = 0;
  if (newY < minY) newY = minY;
  
  space.style.transform = `translate(${newX}px, ${newY}px)`;
  return { x: newX, y: newY };
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
  }
});

viewport.addEventListener('pointermove', (e) => {
  if (activePointerId !== e.pointerId) return;

  const dx = e.clientX - pointerStartX;
  const dy = e.clientY - pointerStartY;

  if (Math.hypot(dx, dy) > MOVE_THRESHOLD) moved = true;

  if (pointerDownOnItem && draggingItem) {
    let newX = itemStartX + dx;
    let newY = itemStartY + dy;

    const spaceW = space.clientWidth;
    const spaceH = space.clientHeight;
    const itemW = draggingItem.offsetWidth;
    const itemH = draggingItem.offsetHeight;

    if (newX < 0) newX = 0;
    if (newX + itemW > spaceW) newX = spaceW - itemW;
    
    if (newY < 0) newY = 0;
    if (newY + itemH > spaceH) newY = spaceH - itemH;

    draggingItem.style.left = newX + 'px';
    draggingItem.style.top = newY + 'px';
    
  } else if (isPanning) {
    currentPanDX = dx;
    currentPanDY = dy;
    updateSpaceTransform(currentPanDX, currentPanDY);
  }
});

viewport.addEventListener('pointerup', (e) => {
  if (activePointerId !== e.pointerId) return;

  if (pointerDownOnItem && draggingItem) {
    draggingItem.style.transition = '';
    draggingItem.style.zIndex = '';

    if (!moved) {
      openOverlay(draggingItem.src, draggingItem.alt || '');
    }

    draggingItem = null;
    pointerDownOnItem = false;
  } else if (isPanning) {
    const finalPos = updateSpaceTransform(currentPanDX, currentPanDY);
    offsetX = finalPos.x;
    offsetY = finalPos.y;
    
    currentPanDX = 0;
    currentPanDY = 0;
    isPanning = false;
    viewport.classList.remove('dragging');
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
    updateSpaceTransform(0, 0); 
    currentPanDX = 0;
    currentPanDY = 0;
    isPanning = false;
    viewport.classList.remove('dragging');
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
    titulo = "Pa amb tomàquet";
titulo2 = "Bread with Tomato";
descripcion = "A simple yet iconic Catalan starter made with rustic bread rubbed with tomato and seasoned with olive oil and salt.";
descripcion2 = "Made with: country bread, ripe tomato, extra virgin olive oil, and salt.";
descripcion3 = "A symbol of Catalan cuisine, valued for its simplicity, quality ingredients, and everyday tradition.";

  } else if (nombreArchivo === "img2.png") {
   titulo = "Escalivada";
titulo2 = "Roasted Vegetables";
descripcion = "A traditional Catalan dish of slow-roasted vegetables, often served as a starter or side.";
descripcion2 = "Made with: eggplant, red pepper, onion, olive oil, and salt.";
descripcion3 = "Its name comes from the Catalan word ‘escalivar’, meaning to cook over embers, highlighting its rustic origins.";

  } else if (nombreArchivo === "img3.png") {
   titulo = "Esqueixada de bacallà";
titulo2 = "Salt Cod Salad";
descripcion = "A refreshing Catalan salad made with shredded salt cod, perfect for warm weather.";
descripcion2 = "Made with: salt cod, tomato, onion, olives, olive oil, and vinegar.";
descripcion3 = "The cod is traditionally torn by hand, giving the dish its name and distinctive texture.";

    } else if (nombreArchivo === "img4.png") {
    titulo = "Escudella i carn d’olla";
titulo2 = "Catalan Meat and Vegetable Stew";
descripcion = "A traditional Catalan winter dish combining soup, vegetables, and meat. It’s the heart of Christmas meals in Catalonia.";
descripcion2 = "Made with: beef shank, chicken, butifarra sausage, pork bones, pilota (meatball), chickpeas, cabbage, carrot, potato, leek, celery, turnip, galets pasta, salt, and olive oil.";
descripcion3 = "Considered the oldest known Catalan stew. Every family has its own recipe — it’s a symbol of homemade comfort and holiday celebration.";

    } else if (nombreArchivo === "img5.png") {
   titulo = "Butifarra amb mongetes";
titulo2 = "Sausage with White Beans";
descripcion = "A classic Catalan main dish pairing grilled butifarra sausage with tender white beans.";
descripcion2 = "Made with: butifarra sausage, white beans, garlic, parsley, olive oil, and salt.";
descripcion3 = "A rustic and hearty dish deeply rooted in rural Catalan cooking.";

  } else if (nombreArchivo === "img6.png") {
   titulo = "Fricandó";
titulo2 = "Beef Stew with Mushrooms";
descripcion = "A traditional Catalan stew made with thin cuts of beef slowly cooked in a rich sauce.";
descripcion2 = "Made with: beef, mushrooms, onion, tomato, garlic, almonds, olive oil, and herbs.";
descripcion3 = "Often prepared for special occasions, it highlights the importance of mushrooms in Catalan cuisine.";


    } else if (nombreArchivo === "img7.png") {
    titulo = "Suquet de peix";
titulo2 = "Fish Stew";
descripcion = "A classic coastal Catalan dish featuring fish cooked in a flavorful broth.";
descripcion2 = "Made with: assorted fish, potatoes, garlic, tomato, almonds, olive oil, and saffron.";
descripcion3 = "Originally a fisherman’s meal, made aboard boats using the day’s catch.";

    } else if (nombreArchivo === "img8.png") {
   titulo = "Crema catalana";
titulo2 = "Catalan Cream";
descripcion = "A traditional Catalan dessert similar to crème brûlée, with a citrus and cinnamon aroma.";
descripcion2 = "Made with: milk, egg yolks, sugar, lemon peel, cinnamon, and cornstarch.";
descripcion3 = "Traditionally served on Saint Joseph’s Day and considered one of Catalonia’s most iconic desserts.";

  } else if (nombreArchivo === "img9.png") {
  titulo = "Mel i mató";
titulo2 = "Fresh Cheese with Honey";
descripcion = "A light and traditional Catalan dessert combining fresh cheese with honey.";
descripcion2 = "Made with: mató (fresh cheese) and honey.";
descripcion3 = "A simple dessert that reflects the pastoral roots of Catalan gastronomy.";


    } else if (nombreArchivo === "img11.png") {
   titulo = "Panellets";
  titulo2 = "Catalan Marzipan Sweets";
  descripcion = "Small traditional sweets eaten during All Saints’ Day celebrations.";
  descripcion2 = "Made with: ground almonds, sugar, egg, pine nuts, and sometimes cocoa or coconut.";
  descripcion3 = "Closely linked to autumn traditions and family gatherings.";

    } else if (nombreArchivo === "img10.png") {
  titulo = "Coca catalana";
titulo2 = "Catalan Sweet Flatbread";
descripcion = "A traditional Catalan baked pastry that can be sweet or savory.";
descripcion2 = "Made with: flour, sugar, eggs, olive oil, yeast, and toppings such as fruit or cream.";
descripcion3 = "A versatile and festive dish enjoyed during celebrations and everyday meals.";

  }

  const t1 = document.getElementById('Title');
  if(t1) t1.textContent = titulo;
  
  const t2 = document.getElementById('Title2');
  if(t2) t2.textContent = titulo2;

  const d1 = document.getElementById('Desc');
  if(d1) d1.textContent = descripcion;

  const d2 = document.getElementById('Desc2');
  if(d2) d2.textContent = descripcion2;
  
  const d3 = document.getElementById('Desc3');
  if(d3) d3.textContent = descripcion3;
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
console.log('starters button:', filterBtn);
console.log('document' + document);
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
    const filterBtn2 = document.getElementById('filterMain');
    filterBtn2.classList.remove('activo');
    const filterBtn3 = document.getElementById('filterDesserts');
    filterBtn3.classList.remove('activo');

    items.forEach(item => {
      if (item.classList.contains('starters')) {
        item.classList.add('activa');
      } else {
        item.classList.remove('activa');
      }
    });
  });
}

const filterBtn2 = document.getElementById('filterMain');
console.log(filterBtn2);
let filtroActivo2 = false; 

if (filterBtn2) {
  filterBtn2.addEventListener('click', (e) => {
    e.preventDefault();

    if (filtroActivo2) {
      document.body.classList.remove('filtrando');
      items.forEach(item => item.classList.remove('activa'));
      filterBtn2.classList.remove('activo');
      filtroActivo2 = false;
      return;
    }

    document.body.classList.add('filtrando');
    filterBtn2.classList.add('activo');
    const filterBtn = document.getElementById('filterStarters');
    filterBtn.classList.remove('activo');
    const filterBtn3 = document.getElementById('filterDesserts');
    filterBtn3.classList.remove('activo');
    filtroActivo2 = true;

    items.forEach(item => {
      if (item.classList.contains('main')) {
        item.classList.add('activa');
      } else {
        item.classList.remove('activa');
      }
    });
  });
}

const filterBtn3 = document.getElementById('filterDesserts');
let filtroActivo3 = false; 

if (filterBtn3) {
  filterBtn3.addEventListener('click', (e) => {
    e.preventDefault();

    if (filtroActivo3) {
      document.body.classList.remove('filtrando');
      items.forEach(item => item.classList.remove('activa'));
      filterBtn3.classList.remove('activo');
      filtroActivo3 = false;
      return;
    }

    document.body.classList.add('filtrando');
    filterBtn3.classList.add('activo');
    const filterBtn = document.getElementById('filterStarters');
    filterBtn.classList.remove('activo');
    const filterBtn2 = document.getElementById('filterMain');
    filterBtn2.classList.remove('activo');
    filtroActivo3 = true;

    items.forEach(item => {
      if (item.classList.contains('desserts')) {
        item.classList.add('activa');
      } else {
        item.classList.remove('activa');
      }
    });
  });
}

const introImage = document.getElementById("intro-image");
if (introImage) {
  introImage.addEventListener("click", () => {
    const intro = document.getElementById("intro-screen");
    intro.style.display = "none";
    const headerLogo = document.getElementById("header-logo");
    headerLogo.style.display = "flex";
  });
}

const aboutText = document.getElementById("about-text");
aboutText.addEventListener("click", () => {
  const about = document.getElementById("about-screen");
  console.log(about);
  const intro = document.getElementById("intro-screen");
  if(about.style.display != "none") {
    about.style.display = "none";
    intro.style.display = "flex";
  }
  else {
    intro.style.display = "none";
    about.style.display = "flex";
  }
});

const headerLogo = document.querySelector("#main-header .header-logo");
if (headerLogo) {
  headerLogo.addEventListener("click", () => {
    const intro = document.getElementById("intro-screen");
    intro.style.display = "flex"; 
    headerLogo.style.display = "none";
  });
}