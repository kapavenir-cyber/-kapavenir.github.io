/* ═══════════════════════════════════════════════
   CONTENU — modifie ici le crew, les tees et le blog
═══════════════════════════════════════════════ */
const CREW = [
  { name: 'Jo "Tamarin"', role: 'Fondateur', bike: 'Triumph Street Triple', photo: 'img/crew-1.jpg' },
  { name: 'Mika',         role: 'Road captain', bike: 'Yamaha MT-09',        photo: 'img/crew-2.jpg' },
  { name: 'Sarah',        role: 'Photographe', bike: 'Kawasaki Z650',        photo: 'img/crew-3.jpg' },
  { name: 'Kévin',        role: 'Mécano du crew', bike: 'Honda CB750 Hornet', photo: 'img/crew-4.jpg' },
  { name: 'Lina',         role: 'Rideuse', bike: 'Ducati Monster',           photo: 'img/crew-5.jpg' },
  { name: 'Dédé',         role: 'Le doyen', bike: 'BMW R nineT',             photo: 'img/crew-6.jpg' },
];

const PRODUCTS = [
  { id: 'logo-tee',   name: 'Logo Tee',     price: 30, badge: 'Best-seller', print: 'KAP/RIDERS',
    colors: [['Noir', '#111113'], ['Blanc', '#ecebe6'], ['Orange', '#ff5a1f']] },
  { id: 'volcan-tee', name: 'Volcan Tee',   price: 35, badge: 'Série limitée', print: 'VOLCAN',
    colors: [['Noir', '#111113'], ['Sable', '#c9b79c']] },
  { id: 'sunday-tee', name: 'Sunday Ride',  price: 32, badge: '', print: 'SUNDAY RIDE',
    colors: [['Blanc', '#ecebe6'], ['Kaki', '#4c5640'], ['Noir', '#111113']] },
  { id: '974-tee',    name: '974 Tee',      price: 30, badge: 'Nouveau', print: '974',
    colors: [['Orange', '#ff5a1f'], ['Noir', '#111113']] },
];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const POSTS = [
  { title: 'Cilaos : 400 virages avant le café', date: '12 oct. 2026', tag: 'Sortie', grad: ['#ff5a1f', '#3a1206'], short: 'CIL',
    excerpt: 'Départ 6h30 de Saint-Louis, 11 bécanes, une route mythique et un brouillard qui s\'est levé pile au bon moment.',
    body: [
      'Départ 6h30 du rond-point de Saint-Louis. Onze motos, des yeux encore collés et une seule idée en tête : avaler la route de Cilaos avant que les voitures ne s\'y mettent.',
      '## La montée',
      'Quatre cents virages, des tunnels taillés dans la roche et des épingles qu\'on prend en première. Le road captain impose un rythme cool : ici on ne fait pas la course, on profite.',
      '## Le café',
      'Arrivée au village vers 8h, café et bouchons à la terrasse. Le brouillard se lève d\'un coup et le cirque apparaît. Personne ne parle pendant une bonne minute.',
      'Prochaine sortie : la route du Volcan, dans deux semaines. Viens avec nous.'
    ] },
  { title: 'Préparer sa moto pour la saison des pluies', date: '28 sept. 2026', tag: 'Mécanique', grad: ['#3b4b5e', '#0d1218'], short: 'MECA',
    excerpt: 'Pneus, freins, chaîne, éclairage : la check-list de Kévin, notre mécano, avant que les averses tropicales arrivent.',
    body: [
      'Ici, quand ça tombe, ça tombe. Kévin, le mécano du crew, nous a donné sa check-list.',
      '## Pneus',
      'Vérifie la profondeur des sculptures (minimum 1 mm, mais vise plutôt 2) et la pression à froid. Un pneu usé sur route mouillée, c\'est non.',
      '## Freins et chaîne',
      'Plaquettes, niveau du liquide, et une chaîne propre et graissée : l\'eau et le sel la tuent en quelques semaines.',
      '## Éclairage',
      'Feux, clignos, feu stop. Être vu compte autant que voir.'
    ] },
  { title: 'Le drop Volcan Tee est en ligne', date: '15 sept. 2026', tag: 'Shop', grad: ['#ffb21f', '#5a2a00'], short: 'DROP',
    excerpt: 'Cinquante pièces, sérigraphiées à Saint-Pierre, inspirées des coulées du Piton de la Fournaise.',
    body: [
      'Le Volcan Tee est arrivé. Cinquante pièces seulement, numérotées, sérigraphiées dans un atelier de Saint-Pierre.',
      'Le visuel reprend les lignes des coulées de 2007, dessinées par Sarah, notre photographe.',
      'Coton bio 220 g, coupe un peu large. Quand c\'est parti, c\'est parti.'
    ] },
];

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const $ = (s, el = document) => el.querySelector(s);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const range = (p, start, end) => clamp((p - start) / (end - start));
const euro = n => n.toLocaleString('fr-FR') + ' €';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function teeSVG(color, print) {
  const dark = ['#111113', '#4c5640', '#ff5a1f'].includes(color);
  const ink = color === '#ff5a1f' ? '#111113' : dark ? '#f2efe9' : '#111113';
  const fs = print.length > 6 ? 20 : print.length > 3 ? 30 : 44;
  return `<svg viewBox="0 0 300 300" aria-hidden="true">
    <path d="M100 30 L60 45 L15 90 L45 130 L75 110 L75 275 L225 275 L225 110 L255 130 L285 90 L240 45 L200 30 C190 52 170 62 150 62 C130 62 110 52 100 30 Z"
      fill="${color}" stroke="rgba(255,255,255,.12)" stroke-width="2"/>
    <path d="M100 30 C110 52 130 62 150 62 C170 62 190 52 200 30" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="5"/>
    <text x="150" y="${130 + fs / 3}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${fs}" fill="${ink}" letter-spacing="1">${esc(print)}</text>
    <circle cx="150" cy="${165 + fs / 3}" r="3" fill="#ff5a1f"/>
  </svg>`;
}

/* ═══════════════════════════════════════════════
   RENDER
═══════════════════════════════════════════════ */
$('#year').textContent = new Date().getFullYear();

$('#crewTrack').innerHTML = CREW.map((r, i) => `
  <article class="rider">
    <div class="rider-photo">
      <span class="rider-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="rider-ph">${esc(r.name.replace(/[^A-Za-zÀ-ÿ]/g, '').charAt(0))}</span>
      <img src="${esc(r.photo)}" alt="${esc(r.name)}" loading="lazy" onerror="this.remove()">
    </div>
    <h3>${esc(r.name)}</h3>
    <p>${esc(r.role)} · ${esc(r.bike)}</p>
  </article>`).join('');

const selection = {};
function renderProducts() {
  $('#products').innerHTML = PRODUCTS.map(p => {
    const sel = selection[p.id] || (selection[p.id] = { color: 0, size: 'M' });
    return `
    <article class="product" data-id="${p.id}">
      <div class="product-visual">
        ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}
        ${teeSVG(p.colors[sel.color][1], p.print)}
      </div>
      <div class="product-body">
        <div class="product-top"><h3>${esc(p.name)}</h3><span class="price">${euro(p.price)}</span></div>
        <div class="opts">${p.colors.map((c, i) =>
          `<button class="swatch ${i === sel.color ? 'on' : ''}" style="background:${c[1]}" data-color="${i}" aria-label="${c[0]}" title="${c[0]}"></button>`).join('')}
        </div>
        <div class="opts">${SIZES.map(s =>
          `<button class="size ${s === sel.size ? 'on' : ''}" data-size="${s}">${s}</button>`).join('')}
        </div>
        <button class="btn" data-add>Ajouter au panier</button>
      </div>
    </article>`;
  }).join('');
  observeReveal('.product');
}
renderProducts();

$('#products').addEventListener('click', e => {
  const card = e.target.closest('.product'); if (!card) return;
  const id = card.dataset.id, sel = selection[id];
  if (e.target.dataset.color) { sel.color = +e.target.dataset.color; renderProducts(); revealAll('.product'); }
  else if (e.target.dataset.size) { sel.size = e.target.dataset.size; renderProducts(); revealAll('.product'); }
  else if ('add' in e.target.dataset) addToCart(id, sel.color, sel.size);
});

$('#posts').innerHTML = POSTS.map((p, i) => `
  <button class="post" data-post="${i}">
    <div class="post-cover"><div class="cv" style="background:linear-gradient(135deg, ${p.grad[0]}, ${p.grad[1]})"><span>${esc(p.short)}</span></div></div>
    <span class="post-meta">${esc(p.tag)} · ${esc(p.date)}</span>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.excerpt)}</p>
  </button>`).join('');
observeReveal('.post');

$('#posts').addEventListener('click', e => {
  const b = e.target.closest('.post'); if (!b) return;
  const p = POSTS[+b.dataset.post];
  $('#articleInner').innerHTML = `
    <div class="article-cover" style="background:linear-gradient(135deg, ${p.grad[0]}, ${p.grad[1]})"></div>
    <span class="post-meta">${esc(p.tag)} · ${esc(p.date)}</span>
    <h1>${esc(p.title)}</h1>
    ${p.body.map(t => t.startsWith('## ') ? `<h2>${esc(t.slice(3))}</h2>` : `<p>${esc(t)}</p>`).join('')}`;
  $('#article').scrollTop = 0;
  document.body.classList.add('article-open');
});
$('#closeArticle').onclick = () => document.body.classList.remove('article-open');

/* ═══════════════════════════════════════════════
   CART (sauvegardé dans le navigateur)
═══════════════════════════════════════════════ */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('kap-cart')) || []; } catch (e) { cart = []; }
const saveCart = () => { try { localStorage.setItem('kap-cart', JSON.stringify(cart)); } catch (e) {} };

function addToCart(id, color, size) {
  const line = cart.find(l => l.id === id && l.color === color && l.size === size);
  line ? line.qty++ : cart.push({ id, color, size, qty: 1 });
  saveCart(); renderCart(); toast('Ajouté au panier ✓');
}
function renderCart() {
  const count = cart.reduce((n, l) => n + l.qty, 0);
  $('#cartCount').textContent = count;
  let total = 0;
  $('#cartItems').innerHTML = cart.length ? cart.map((l, i) => {
    const p = PRODUCTS.find(x => x.id === l.id); if (!p) return '';
    const c = p.colors[l.color] || p.colors[0];
    total += p.price * l.qty;
    return `<div class="line">
      <div class="line-thumb">${teeSVG(c[1], p.print)}</div>
      <div><h4>${esc(p.name)}</h4><small>${esc(c[0])} · ${l.size}</small>
        <div class="qty"><button data-dec="${i}" aria-label="Moins">−</button><span>${l.qty}</span><button data-inc="${i}" aria-label="Plus">+</button></div>
      </div>
      <strong>${euro(p.price * l.qty)}</strong>
    </div>`;
  }).join('') : '<p class="empty">Ton panier est vide.</p>';
  $('#cartTotal').textContent = euro(total);
}
$('#cartItems').addEventListener('click', e => {
  const { inc, dec } = e.target.dataset;
  if (inc !== undefined) cart[+inc].qty++;
  else if (dec !== undefined) { cart[+dec].qty--; if (!cart[+dec].qty) cart.splice(+dec, 1); }
  else return;
  saveCart(); renderCart();
});
renderCart();

const openCart = () => document.body.classList.add('cart-open');
const closeCart = () => document.body.classList.remove('cart-open');
$('#cartBtn').onclick = openCart;
$('#closeCart').onclick = closeCart;
$('#overlay').onclick = closeCart;

// Commande par e-mail. Pour un vrai paiement, remplace par des liens Stripe Payment Links ou Snipcart.
$('#checkout').onclick = () => {
  if (!cart.length) return toast('Ton panier est vide');
  const lines = cart.map(l => {
    const p = PRODUCTS.find(x => x.id === l.id);
    return `- ${l.qty} x ${p.name} (${p.colors[l.color][0]}, ${l.size}) = ${euro(p.price * l.qty)}`;
  });
  const total = cart.reduce((s, l) => s + PRODUCTS.find(x => x.id === l.id).price * l.qty, 0);
  const body = `Salut KAP RIDERS,\n\nJe voudrais commander :\n${lines.join('\n')}\n\nTotal : ${euro(total)}\n\nNom :\nAdresse / point de retrait :\nTéléphone :`;
  location.href = `mailto:contact@kapriders.re?subject=${encodeURIComponent('Commande shop')}&body=${encodeURIComponent(body)}`;
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
   SCROLL ANIMATIONS
═══════════════════════════════════════════════ */
const hero = $('#hero'), title = $('#heroTitle'), bike = $('#bike'), glow = $('#heroGlow');
const lines = $('#heroLines'), bar = $('#heroBar'), hint = $('#scrollHint');
const bikeParts = [...bike.querySelectorAll('path, circle:not([stroke-dasharray])')];
const discs = bike.querySelectorAll('circle[stroke-dasharray]');
const crew = $('#crew'), track = $('#crewTrack');

// manifesto : un span par mot
const manifesto = $('#manifesto');
manifesto.innerHTML = manifesto.textContent.trim().split(/\s+/).map(w => `<span class="w">${esc(w)}</span>`).join(' ');
const words = [...manifesto.children];

function sizeCrew() {
  const extra = Math.max(0, track.scrollWidth - innerWidth);
  crew.style.height = `${innerHeight + extra}px`;
  crew.dataset.extra = extra;
}

function sectionProgress(el) {
  const r = el.getBoundingClientRect();
  return clamp(-r.top / (r.height - innerHeight || 1));
}

function onScroll() {
  const vh = innerHeight;

  // HERO
  const p = reduced ? 1 : sectionProgress(hero);
  const draw = range(p, 0.05, 0.55);
  bikeParts.forEach((el, i) => {
    // chaque pièce se dessine avec un léger décalage
    const d = clamp(draw * 1.4 - (i / bikeParts.length) * 0.4);
    el.style.strokeDashoffset = 1 - d;
  });
  discs.forEach(d => { d.style.opacity = range(p, 0.45, 0.55); });
  title.style.transform = `scale(${1 - range(p, 0, 0.5) * 0.35}) translateY(${-range(p, 0.55, 0.9) * 20}vh)`;
  title.style.opacity = 1 - range(p, 0.05, 0.4) * 0.88;
  glow.style.opacity = range(p, 0.4, 0.65);
  glow.style.transform = `scale(${0.6 + range(p, 0.4, 1) * 0.6})`;
  const lift = range(p, 0.62, 0.9);
  bike.style.transform = `scale(${0.85 + draw * 0.2 - lift * 0.2}) translate(${lift * 14}vw, ${-lift * 12}vh)`;
  bike.style.color = draw >= 1 ? 'var(--accent)' : 'var(--text)';
  bike.style.filter = `drop-shadow(0 0 ${range(p, 0.5, 0.65) * 22}px rgba(255,90,31,.6))`;
  lines.style.opacity = range(p, 0.68, 0.85);
  lines.style.transform = `translateY(${(1 - range(p, 0.68, 0.85)) * 40}px)`;
  bar.style.height = `${p * 100}%`;
  hint.style.opacity = 1 - range(p, 0, 0.04);

  // MANIFESTO
  const mr = manifesto.getBoundingClientRect();
  const mp = reduced ? 1 : clamp((vh * 0.85 - mr.top) / (mr.height + vh * 0.35));
  const on = Math.round(mp * words.length);
  words.forEach((w, i) => w.classList.toggle('on', i < on));

  // CREW (scroll vertical → défilement horizontal)
  const cp = sectionProgress(crew);
  track.style.transform = `translateX(${-cp * (+crew.dataset.extra || 0)}px)`;
}

let ticking = false;
addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
}, { passive: true });
addEventListener('resize', () => { sizeCrew(); onScroll(); });
addEventListener('load', () => { sizeCrew(); onScroll(); });
sizeCrew(); onScroll();

/* reveal au scroll */
function observeReveal(sel) {
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll(sel).forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 90}ms`; io.observe(el); });
}
function revealAll(sel) { document.querySelectorAll(sel).forEach(el => { el.style.transitionDelay = '0ms'; el.classList.add('in'); }); }

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
