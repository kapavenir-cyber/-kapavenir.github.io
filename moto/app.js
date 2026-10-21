/* ═══════════════════════════════════════════════
   CONTENU — modifie ici les infos, le crew, le shop et le blog
═══════════════════════════════════════════════ */
const CONFIG = {
  email: 'contact@exemple.com',        // À REMPLACER par l'e-mail du crew
  instagram: 'https://instagram.com/', // À REMPLACER par le lien Instagram du crew
};

const CREW = [
  { name: 'Untamed',    role: 'KTM 990 Duke · nuit & pluie',  photo: 'img/untamed.webp' },
  { name: 'Full speed', role: 'Tee EVS · casque KYT',         photo: 'img/motion.webp' },
  { name: 'Pit stop',   role: 'KTM 990 Duke · station 7',     photo: 'img/station.webp' },
  { name: 'Blue visor', role: 'Casque Nexx · écran iridium',  photo: 'img/nexx.webp' },
  { name: 'Evilshark',  role: 'Tee Flames · casque KYT',      photo: 'img/evilshark.webp' },
];

const PRODUCTS = [
  { id: 'evs-tee',     name: 'Tee EVS Logo',         price: 35, badge: 'Best-seller',   img: 'img/shop-evs.webp' },
  { id: 'flames-tee',  name: 'Tee Evilshark Flames', price: 35, badge: 'Nouveau',       img: 'img/shop-flames.webp' },
  { id: 'untamed-tee', name: 'Tee Untamed',          price: 35, badge: 'Série limitée', img: 'img/shop-untamed.webp' },
  { id: 'stickers',    name: 'Pack stickers EVS',    price: 8,  badge: '',              img: 'img/evs-logo.webp', contain: true, sizes: ['Unique'] },
];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const POSTS = [
  { title: 'Untamed : le shooting de nuit', date: '18 oct. 2026', tag: 'Shooting', cover: 'img/untamed.webp',
    excerpt: 'Pluie fine, station déserte, palmiers dans le noir : les coulisses de la photo qui a donné son nom à la collection.',
    body: [
      'Il est presque minuit quand on se gare sous les néons de la station. La pluie vient de s\'arrêter, le bitume brille encore. Parfait.',
      '## L\'idée',
      'Montrer ce qu\'est le crew : pas des poses de catalogue, mais des riders, leurs bécanes et la nuit réunionnaise.',
      '## Le résultat',
      'Un noir et blanc tranché par le rouge EVS. Une image, un mot : untamed. Il est devenu le nom de notre nouvelle série de tees.'
    ] },
  { title: 'Pit stop : nos checks avant une ride de nuit', date: '2 oct. 2026', tag: 'Mécanique', cover: 'img/station.webp',
    excerpt: 'Pneus, éclairage, chaîne, visière : la check-list du crew avant de partir quand le soleil est couché.',
    body: [
      'Rouler de nuit, c\'est magique. Mais ça se prépare.',
      '## Pneus et freins',
      'Pression à froid, usure, plaquettes. Sur route humide, on ne négocie pas.',
      '## Être vu',
      'Feux, clignos, feu stop. Et une visière propre, ou un écran clair si la route est longue.',
      '## Rester groupés',
      'Intercom allumé, un ouvreur, un serre-file. Personne ne reste derrière.'
    ] },
  { title: 'Le drop Evilshark Flames est en ligne', date: '20 sept. 2026', tag: 'Shop', cover: 'img/evilshark.webp',
    excerpt: 'Le logo flammes arrive sur un tee noir coton lourd. Petite série, premier arrivé, premier servi.',
    body: [
      'Le logo Evilshark entouré de flammes, imprimé en gris clair sur un tee noir épais.',
      'Coupe un peu large, coton lourd qui tient dans le temps. Série limitée.',
      'Quand c\'est parti, c\'est parti.'
    ] },
];

/* Vues éclatées : position de chaque pièce (en % de l'image), déplacement à l'éclatement
   (dx en % de la largeur, dy en % de la hauteur), rotation, échelle, étiquette. */
const MODELS = {
  helmet: { ratio: 0.8354, pieces: [
    { name: 'body',     x: 1.6,    y: 39.014, w: 94.2,   dy: 22, op: .35, label: 'Tee Evilshark', small: 'Coton lourd · sérigraphie', ax: .35, ay: .4 },
    { name: 'chin',     x: 27.5,   y: 21.053, w: 41,     dy: 9, label: 'Mentonnière', small: 'Ventilée', ax: .75, ay: .8 },
    { name: 'visor',    x: 27.4,   y: 14.369, w: 40.7,   dx: -24, dy: -4, rot: -8, s: 1.08, label: 'Écran iridium', small: 'Fumé · anti-buée', ax: .15, side: 'l' },
    { name: 'shell',    x: 27.4,   y: 1.42,   w: 39.9,   dy: -10, rot: -4, label: 'Coque KYT', small: 'Ventilation supérieure', ax: .8, ay: .4 },
    { name: 'intercom', x: 65.2,   y: 24.06,  w: 5.4,    dx: 18, rot: 12, label: 'Intercom', small: 'On roule connectés' },
  ] },
  bike: { ratio: 1.0381, pieces: [
    { name: 'body',    x: 4.083,  y: 26.817, w: 91.667, s: .96, label: 'Moteur LC8c', small: 'Bicylindre · cadre acier', ax: .66, ay: .4 },
    { name: 'stand',   x: 0.75,   y: 63.495, w: 53.5,   dy: 26, op: .5, label: 'Béquille d\'atelier', ax: .12, ay: .85, side: 'l' },
    { name: 'rear',    x: 17.417, y: 41.09,  w: 35,     dx: -22, dy: 6, rot: -30, label: 'Roue arrière', small: 'Jante 17" · disque & étrier', ax: .2, side: 'l' },
    { name: 'tail',    x: 27.25,  y: 19.291, w: 36.5,   dx: -16, dy: -22, rot: -6, label: 'Coque arrière', small: 'Selle & boucle', ax: .15, ay: .3, side: 'l' },
    { name: 'exhaust', x: 44.583, y: 46.972, w: 17,     dx: 12, dy: 30, rot: 8, s: 1.15, label: 'Silencieux IXIL', small: 'Inox · son rauque', ax: .9 },
    { name: 'front',   x: 79.167, y: 32.439, w: 16.75,  dx: 16, dy: 8, rot: 25, label: 'Roue avant', small: 'Freinage radial', ax: .9 },
    { name: 'tank',    x: 55.333, y: 5.017,  w: 39.917, dx: 10, dy: -15, rot: -4, label: 'Réservoir & TFT', small: 'Guidon · écran couleur', ax: .85, ay: .2 },
  ] },
};

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const $ = (s, el = document) => el.querySelector(s);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const range = (p, start, end) => clamp((p - start) / (end - start));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const euro = n => n.toLocaleString('fr-FR') + ' €';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ═══════════════════════════════════════════════
   RENDER
═══════════════════════════════════════════════ */
$('#year').textContent = new Date().getFullYear();
$('#mailLink').href = `mailto:${CONFIG.email}`;
$('#instaLink').href = CONFIG.instagram;

const words = ['Evil Shark Crew', 'Untamed', '974', 'Night ride', 'Ride or die', 'EVS'];
$('#marquee').innerHTML = [...words, ...words].map(w => `<span>${w}</span><span>✦</span>`).join('');

$('#crewTrack').innerHTML = CREW.map((r, i) => `
  <article class="rider">
    <div class="rider-photo">
      <span class="rider-num">${String(i + 1).padStart(2, '0')}</span>
      <img src="${esc(r.photo)}" alt="${esc(r.name)}" loading="lazy">
    </div>
    <h3>${esc(r.name)}</h3>
    <p>${esc(r.role)}</p>
  </article>`).join('');

// Vues éclatées : on construit les pièces et les étiquettes
const stages = Object.entries(MODELS).map(([key, model]) => {
  const section = $(`#${key}`), stage = $(`#${key}Stage`);
  stage.style.setProperty('--ratio', model.ratio);
  const els = model.pieces.map(p => {
    const piece = document.createElement('div');
    piece.className = 'piece';
    piece.style.cssText = `left:${p.x}%;top:${p.y}%;width:${p.w}%`;
    piece.innerHTML = `<img src="img/${key}-${p.name}.webp" alt="">`;
    stage.appendChild(piece);
    const tag = document.createElement('div');
    tag.className = 'tag' + (p.side === 'l' ? ' left' : '');
    tag.innerHTML = `<i></i><span>${esc(p.label)}${p.small ? `<small>${esc(p.small)}</small>` : ''}</span>`;
    stage.appendChild(tag);
    return { p, piece, tag };
  });
  return { section, stage, els, bar: $('.explode-progress span', section) };
});

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
observeReveal('.product');

$('#products').addEventListener('click', e => {
  const card = e.target.closest('.product'); if (!card) return;
  const id = card.dataset.id, sel = selection[id];
  if (e.target.dataset.size) {
    sel.size = e.target.dataset.size;
    card.querySelectorAll('.size').forEach(b => b.classList.toggle('on', b === e.target));
  } else if ('add' in e.target.dataset) addToCart(id, sel.size);
});

$('#posts').innerHTML = POSTS.map((p, i) => `
  <button class="post" data-post="${i}">
    <div class="post-cover"><img src="${esc(p.cover)}" alt="" loading="lazy"></div>
    <span class="post-meta">${esc(p.tag)} · ${esc(p.date)}</span>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.excerpt)}</p>
  </button>`).join('');
observeReveal('.post');

$('#posts').addEventListener('click', e => {
  const b = e.target.closest('.post'); if (!b) return;
  const p = POSTS[+b.dataset.post];
  $('#articleInner').innerHTML = `
    <img class="article-cover" src="${esc(p.cover)}" alt="">
    <span class="post-meta">${esc(p.tag)} · ${esc(p.date)}</span>
    <h1>${esc(p.title)}</h1>
    ${p.body.map(t => t.startsWith('## ') ? `<h2>${esc(t.slice(3))}</h2>` : `<p>${esc(t)}</p>`).join('')}`;
  $('#article').scrollTop = 0;
  document.body.classList.add('article-open');
});
$('#closeArticle').onclick = () => document.body.classList.remove('article-open');

/* ═══════════════════════════════════════════════
   PANIER (sauvegardé dans le navigateur)
═══════════════════════════════════════════════ */
let cart = [];
try { cart = (JSON.parse(localStorage.getItem('evs-cart')) || []).filter(l => PRODUCTS.some(p => p.id === l.id)); } catch (e) { cart = []; }
const saveCart = () => { try { localStorage.setItem('evs-cart', JSON.stringify(cart)); } catch (e) {} };
const product = id => PRODUCTS.find(p => p.id === id);

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
      <div><h4>${esc(p.name)}</h4><small>Taille ${esc(l.size)}</small>
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
  const lines = cart.map(l => `- ${l.qty} x ${product(l.id).name} (taille ${l.size}) = ${euro(product(l.id).price * l.qty)}`);
  const body = `Salut Evil Shark Crew,\n\nJe voudrais commander :\n${lines.join('\n')}\n\nTotal : ${euro(cartTotal())}\n\nNom :\nAdresse / point de retrait :\nTéléphone :`;
  location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Commande shop EVS')}&body=${encodeURIComponent(body)}`;
};

let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ═══════════════════════════════════════════════
   MENU MOBILE
═══════════════════════════════════════════════ */
$('#burger').onclick = () => document.body.classList.toggle('menu-open');
$('#navLinks').addEventListener('click', e => { if (e.target.tagName === 'A') document.body.classList.remove('menu-open'); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.body.classList.remove('cart-open', 'article-open', 'menu-open');
});

/* ═══════════════════════════════════════════════
   ANIMATIONS AU SCROLL
═══════════════════════════════════════════════ */
const hero = $('#hero'), heroWindow = $('#heroWindow'), heroImg = $('#heroImg');
const heroLogo = $('#heroLogo'), heroFoot = $('#heroFoot'), hint = $('#scrollHint');
const crew = $('#crew'), track = $('#crewTrack');

const manifesto = $('#manifesto');
manifesto.innerHTML = manifesto.textContent.trim().split(/\s+/).map(w => `<span class="w">${esc(w)}</span>`).join(' ');
const manifestoWords = [...manifesto.children];

function sizeCrew() {
  const extra = Math.max(0, track.scrollWidth - innerWidth);
  crew.style.height = `${innerHeight + extra}px`;
  crew.dataset.extra = extra;
}

function sectionProgress(el) {
  const r = el.getBoundingClientRect();
  return clamp(-r.top / (r.height - innerHeight || 1));
}

function renderExplode({ section, stage, els, bar }) {
  const p = reduced ? 0.6 : sectionProgress(section);
  // s'éclate, reste ouvert, puis se remonte à la fin de la section
  const e = ease(range(p, 0.08, 0.5)) * (1 - ease(range(p, 0.86, 1)));
  const W = stage.offsetWidth, H = stage.offsetHeight;
  const k = innerWidth < 760 ? 0.6 : 1; // écartement réduit sur mobile
  els.forEach(({ p: c, piece, tag }, i) => {
    const dx = (c.dx || 0) * k * W / 100 * e, dy = (c.dy || 0) * H / 100 * e;
    piece.style.transform = `translate(${dx}px, ${dy}px) rotate(${(c.rot || 0) * e}deg) scale(${1 + ((c.s || 1) - 1) * e})`;
    piece.style.opacity = 1 - (1 - (c.op ?? 1)) * e;
    // étiquette accrochée à la pièce
    const ax = c.x + c.w * (c.ax ?? .5);
    const ay = c.y + (piece.offsetHeight / H * 100) * (c.ay ?? .5);
    tag.style.left = `${ax}%`; tag.style.top = `${ay}%`;
    const t = range(p, 0.42 + i * 0.025, 0.55 + i * 0.025) * (1 - range(p, 0.82, 0.88));
    const shift = c.side === 'l' ? `calc(-100% + 6px)` : '-6px';
    const base = `translate(${dx}px, ${dy}px) translate(${shift}, -50%) translateX(${(1 - t) * (c.side === 'l' ? -12 : 12)}px)`;
    tag.style.transform = base;
    tag.style.opacity = t;
    // garde l'étiquette dans l'écran (petits écrans)
    if (t > 0) {
      const r = tag.getBoundingClientRect();
      const fix = Math.max(0, 8 - r.left) - Math.max(0, r.right - (innerWidth - 8));
      if (fix) tag.style.transform = `${base} translateX(${fix}px)`;
    }
  });
  bar.style.height = `${p * 100}%`;
}

function onScroll() {
  const vh = innerHeight;

  // HERO : la fenêtre s'ouvre sur la photo, le logo s'efface
  const p = reduced ? 1 : sectionProgress(hero);
  const open = ease(range(p, 0.08, 0.6));
  const inset = 40 * (1 - open);
  heroWindow.style.clipPath = `inset(${inset}% ${inset * 0.9}% ${inset}% ${inset * 0.9}% round ${24 * (1 - open)}px)`;
  heroImg.style.transform = `scale(${1.4 - open * 0.4})`;
  heroLogo.style.transform = `translateY(${-range(p, 0.1, 0.6) * 30}vh) scale(${1 - range(p, 0.1, 0.6) * 0.55})`;
  heroLogo.style.opacity = 1 - range(p, 0.5, 0.7);
  heroFoot.style.opacity = range(p, 0.7, 0.85);
  hint.style.opacity = 1 - range(p, 0, 0.04);

  stages.forEach(renderExplode);

  // MANIFESTO
  const mr = manifesto.getBoundingClientRect();
  const mp = reduced ? 1 : clamp((vh * 0.85 - mr.top) / (mr.height + vh * 0.35));
  const on = Math.round(mp * manifestoWords.length);
  manifestoWords.forEach((w, i) => w.classList.toggle('on', i < on));

  // CREW : scroll vertical → défilement horizontal
  track.style.transform = `translateX(${-sectionProgress(crew) * (+crew.dataset.extra || 0)}px)`;
}

let ticking = false;
addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
}, { passive: true });
addEventListener('resize', () => { sizeCrew(); onScroll(); });
addEventListener('load', () => { sizeCrew(); onScroll(); });
sizeCrew(); onScroll();

/* apparition au scroll */
function observeReveal(sel) {
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll(sel).forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 90}ms`; io.observe(el); });
}

/* compteurs */
const counterIO = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  const el = en.target, target = +el.dataset.count, t0 = performance.now(), dur = 1600;
  const step = now => {
    const k = clamp((now - t0) / dur), eased = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(target * eased).toLocaleString('fr-FR');
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  counterIO.unobserve(el);
}), { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));
