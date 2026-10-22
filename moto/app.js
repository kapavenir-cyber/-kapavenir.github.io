/* ═══════════════════════════════════════════════
   CONTENU — modifie ici les infos, le crew, les machines et le shop
═══════════════════════════════════════════════ */
const CONFIG = {
  email: 'kenjy.apaya@gmail.com',
  instagram: 'https://www.instagram.com/evil_sharrk/',
};

const CREW = [
  { name: 'Untamed',    role: 'KTM 990 Duke · nuit & pluie',  photo: 'img/untamed.webp' },
  { name: 'Full speed', role: 'Tee EVS · casque KYT',         photo: 'img/motion.webp' },
  { name: 'Pit stop',   role: 'KTM 990 Duke · station 7',     photo: 'img/station.webp' },
  { name: 'Blue visor', role: 'Casque Nexx · écran iridium',  photo: 'img/nexx.webp' },
  { name: 'Evilshark',  role: 'Tee Flames · casque KYT',      photo: 'img/evilshark.webp' },
];

const MACHINES = [
  { id: 'ktm', tab: 'KTM 990 Duke', name: 'KTM 990 Duke', tag: 'Hyper naked · 2024', imgs: ['img/ktm-front.webp', 'img/ktm-990.webp'],
    text: 'La bête noire du crew. Bicylindre rageur, châssis affûté et phare LED en V : faite pour les virages de l\'île et les rides de nuit.',
    points: ['Silencieux IXIL', 'Leviers orange réglables', 'Rétros bar-end'],
    specs: [['Moteur', 'Bicylindre LC8c 947 cm³'], ['Puissance', '123 ch à 9 500 tr/min'], ['Couple', '103 Nm à 6 750 tr/min'],
            ['Poids à sec', '179 kg'], ['Hauteur de selle', '825 mm'], ['Réservoir', '14,8 L'], ['Boîte', '6 rapports, quickshifter']] },
  { id: 'brz', tab: 'Subaru BRZ', name: 'Subaru BRZ', tag: 'Coupé propulsion · 2017', imgs: ['img/brz-34.webp', 'img/brz-front.webp', 'img/brz-rear.webp'],
    text: 'Le coupé du crew. Moteur boxer, propulsion et centre de gravité au ras du sol : la voiture plaisir par excellence, en gris argent.',
    points: ['Phares LED', 'Jantes 17"', 'Couleur gris argent'],
    specs: [['Moteur', 'Boxer 4 cylindres 2,0 L'], ['Puissance', '200 ch à 7 000 tr/min'], ['Couple', '205 Nm'],
            ['Transmission', 'Propulsion'], ['Boîte', '6 rapports'], ['Places', '2+2']] },
];

// Mur du crew : ajoute ici les photos envoyées par la communauté (après validation)
const WALL = [
  { src: 'img/station.webp',   by: '@evil_sharrk' },
  { src: 'img/motion.webp',    by: '@evil_sharrk' },
  { src: 'img/brz-rear.webp',  by: '@evil_sharrk' },
  { src: 'img/evilshark.webp', by: '@evil_sharrk' },
  { src: 'img/nexx.webp',      by: '@evil_sharrk' },
];

const OFFERS = [
  { id: 'shooting', name: 'Shooting',          price: 39.99, img: 'img/untamed.webp', desc: 'Séance photo de nuit avec ta machine.' },
  { id: 'edit',     name: 'Edit',              price: 59.99, img: 'img/untamed.webp', desc: 'Retouche pro de tes photos, style EVS.' },
  { id: 'pack',     name: 'Pack shooting + edit', price: 149.99, img: 'img/untamed.webp', desc: 'La séance et la retouche, le combo complet.', best: true },
];

const PRODUCTS = [
  { id: 'evs-tee',     name: 'Tee EVS Logo',         price: 35, badge: 'Best-seller',   img: 'img/shop-evs.webp' },
  { id: 'flames-tee',  name: 'Tee Evilshark Flames', price: 35, badge: 'Nouveau',       img: 'img/shop-flames.webp' },
  { id: 'untamed-tee', name: 'Tee Untamed',          price: 35, badge: 'Série limitée', img: 'img/shop-untamed.webp' },
  { id: 'stickers',    name: 'Pack stickers EVS',    price: 8,  badge: '',              img: 'img/evs-logo.webp', contain: true, sizes: ['Unique'] },
];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const $ = (s, el = document) => el.querySelector(s);
const euro = n => n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

$('#year').textContent = new Date().getFullYear();
$('#mailLink').href = `mailto:${CONFIG.email}`;
$('#instaLink').href = $('#instaInline').href = CONFIG.instagram;
$('#wallInsta').href = 'https://ig.me/m/evil_sharrk';
$('#wallMail').href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Photo pour le mur EVS')}&body=${encodeURIComponent('Salut ! Voici ma photo pour le mur du crew (en pièce jointe).\n\nMon pseudo / Instagram : ')}`;

/* ═══════════════════════════════════════════════
   NAV : fond plein après le haut de page
═══════════════════════════════════════════════ */
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('solid', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

$('#burger').onclick = () => document.body.classList.toggle('menu-open');
$('#navLinks').addEventListener('click', e => { if (e.target.tagName === 'A') document.body.classList.remove('menu-open'); });

/* ═══════════════════════════════════════════════
   CREW : carrousel
═══════════════════════════════════════════════ */
const track = $('#crewTrack');
track.innerHTML = CREW.map(r => `
  <figure class="card">
    <img src="${esc(r.photo)}" alt="${esc(r.name)}" loading="lazy">
    <figcaption><strong>${esc(r.name)}</strong><span>${esc(r.role)}</span></figcaption>
  </figure>`).join('');
const carousel = $('.carousel');
const step = () => track.firstElementChild.offsetWidth + 16;
$('#prev').onclick = () => carousel.scrollBy({ left: -step(), behavior: 'smooth' });
$('#next').onclick = () => carousel.scrollBy({ left: step(), behavior: 'smooth' });

/* ═══════════════════════════════════════════════
   MACHINES + FICHE TECHNIQUE (onglets)
═══════════════════════════════════════════════ */
$('#tabs').innerHTML = MACHINES.map((m, i) =>
  `<button class="tab ${i ? '' : 'on'}" role="tab" data-i="${i}">${esc(m.tab)}</button>`).join('');
const machineImg = $('#machineImg');
function showMachine(i) {
  const m = MACHINES[i];
  document.querySelectorAll('.tab').forEach((t, k) => t.classList.toggle('on', k === i));
  $('#machineText').innerHTML = `
    <span class="tag">${esc(m.tag)}</span>
    <h3>${esc(m.name)}</h3>
    <p>${esc(m.text)}</p>
    <ul>${m.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`;
  $('#specBody').innerHTML = m.specs.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
  $('#thumbs').innerHTML = m.imgs.map((src, k) => `<button class="${k ? '' : 'on'}" data-src="${src}"><img src="${src}" alt=""></button>`).join('');
  setPhoto(m.imgs[0], m.name);
}
function setPhoto(src, alt) {
  machineImg.classList.add('swap');
  setTimeout(() => { machineImg.src = src; if (alt) machineImg.alt = alt; machineImg.classList.remove('swap'); }, machineImg.src ? 250 : 0);
}
$('#thumbs').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  document.querySelectorAll('#thumbs button').forEach(x => x.classList.toggle('on', x === b));
  setPhoto(b.dataset.src);
});
$('#tabs').addEventListener('click', e => { if (e.target.dataset.i) showMachine(+e.target.dataset.i); });
showMachine(0);

/* ═══════════════════════════════════════════════
   SHOOTING : offres
═══════════════════════════════════════════════ */
$('#offers').innerHTML = OFFERS.map(o => `
  <div class="offer ${o.best ? 'best' : ''}">
    ${o.best ? '<span class="badge">Le + choisi</span>' : ''}
    <h3>${esc(o.name)}</h3>
    <p>${esc(o.desc)}</p>
    <strong class="offer-price">${euro(o.price)}</strong>
    <button class="btn btn-sm" data-offer="${o.id}">Réserver</button>
  </div>`).join('');
$('#offers').addEventListener('click', e => { if (e.target.dataset.offer) addToCart(e.target.dataset.offer, 'Unique'); });

/* ═══════════════════════════════════════════════
   MUR DU CREW + plein écran
═══════════════════════════════════════════════ */
$('#wallGrid').innerHTML = WALL.map(w => `<button data-src="${w.src}"><img src="${w.src}" alt="Photo de ${esc(w.by)}" loading="lazy"><span>${esc(w.by)}</span></button>`).join('');
const lightbox = $('#lightbox');
$('#wallGrid').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $('#lightboxImg').src = b.dataset.src; lightbox.classList.add('open');
});
lightbox.onclick = () => lightbox.classList.remove('open');

/* ═══════════════════════════════════════════════
   SHOP
═══════════════════════════════════════════════ */
const selection = {};
function renderProducts() {
  $('#products').innerHTML = PRODUCTS.map(p => {
    const sizes = p.sizes || SIZES;
    const sel = selection[p.id] || (selection[p.id] = { size: sizes.includes('M') ? 'M' : sizes[0] });
    return `
    <article class="product" data-id="${p.id}">
      <div class="product-visual">
        ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}
        <img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy" ${p.contain ? 'class="contain"' : ''}>
      </div>
      <div class="product-body">
        <div class="product-top"><h3>${esc(p.name)}</h3><span class="price">${euro(p.price)}</span></div>
        <div class="opts">${sizes.map(s =>
          `<button class="size ${s === sel.size ? 'on' : ''}" data-size="${s}">${s}</button>`).join('')}
        </div>
        <button class="btn" data-add>Ajouter au panier</button>
      </div>
    </article>`;
  }).join('');
}
renderProducts();

$('#products').addEventListener('click', e => {
  const card = e.target.closest('.product'); if (!card) return;
  const id = card.dataset.id, sel = selection[id];
  if (e.target.dataset.size) {
    sel.size = e.target.dataset.size;
    card.querySelectorAll('.size').forEach(b => b.classList.toggle('on', b === e.target));
  } else if ('add' in e.target.dataset) addToCart(id, sel.size);
});

/* ═══════════════════════════════════════════════
   PANIER (sauvegardé dans le navigateur)
═══════════════════════════════════════════════ */
const product = id => PRODUCTS.find(p => p.id === id) || OFFERS.find(o => o.id === id);
let cart = [];
try { cart = (JSON.parse(localStorage.getItem('evs-cart')) || []).filter(l => product(l.id)); } catch (e) { cart = []; }
const saveCart = () => { try { localStorage.setItem('evs-cart', JSON.stringify(cart)); } catch (e) {} };

function addToCart(id, size) {
  const line = cart.find(l => l.id === id && l.size === size);
  line ? line.qty++ : cart.push({ id, size, qty: 1 });
  saveCart(); renderCart(); toast('Ajouté au panier ✓');
}
function renderCart() {
  $('#cartCount').textContent = cart.reduce((n, l) => n + l.qty, 0);
  $('#cartItems').innerHTML = cart.length ? cart.map((l, i) => {
    const p = product(l.id);
    return `<div class="line">
      <img src="${esc(p.img)}" alt="">
      <div><h4>${esc(p.name)}</h4><small>${l.size === 'Unique' ? (OFFERS.some(o => o.id === l.id) ? 'Shooting photo' : 'Taille unique') : 'Taille ' + esc(l.size)}</small>
        <div class="qty"><button data-dec="${i}" aria-label="Moins">−</button><span>${l.qty}</span><button data-inc="${i}" aria-label="Plus">+</button></div>
      </div>
      <strong>${euro(p.price * l.qty)}</strong>
    </div>`;
  }).join('') : '<p class="empty">Ton panier est vide.</p>';
  $('#cartTotal').textContent = euro(cartTotal());
}
const cartTotal = () => cart.reduce((s, l) => s + product(l.id).price * l.qty, 0);

$('#cartItems').addEventListener('click', e => {
  const { inc, dec } = e.target.dataset;
  if (inc !== undefined) cart[+inc].qty++;
  else if (dec !== undefined) { cart[+dec].qty--; if (!cart[+dec].qty) cart.splice(+dec, 1); }
  else return;
  saveCart(); renderCart();
});
renderCart();

const closeCart = () => document.body.classList.remove('cart-open');
$('#cartBtn').onclick = () => document.body.classList.add('cart-open');
$('#closeCart').onclick = closeCart;
$('#overlay').onclick = closeCart;

// Commande par e-mail. Pour un vrai paiement, remplace par des liens Stripe Payment Links ou Snipcart.
$('#checkout').onclick = () => {
  if (!cart.length) return toast('Ton panier est vide');
  const lines = cart.map(l => `- ${l.qty} x ${product(l.id).name} ${l.size === 'Unique' ? '' : `(taille ${l.size})`} = ${euro(product(l.id).price * l.qty)}`);
  const body = `Salut Evil Shark Crew,\n\nJe voudrais commander :\n${lines.join('\n')}\n\nTotal : ${euro(cartTotal())}\n\nNom :\nAdresse / point de retrait :\nTéléphone :`;
  location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Commande shop EVS')}&body=${encodeURIComponent(body)}`;
};

let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1800);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { document.body.classList.remove('cart-open', 'menu-open'); lightbox.classList.remove('open'); }
});

/* apparition au scroll */
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
