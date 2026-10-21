/* ═══════════════════════════════════════════════
   GARAGE 3D — Evil Shark Crew
   Scène three.js : garage équipé, Subaru BRZ, KTM 990 Duke, le pilote.
   La caméra suit un parcours piloté par le scroll.
═══════════════════════════════════════════════ */
import * as THREE from 'three';
import { RoomEnvironment } from './vendor/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from './vendor/addons/geometries/RoundedBoxGeometry.js';
import { Reflector } from './vendor/addons/objects/Reflector.js';
import { EffectComposer } from './vendor/addons/postprocessing/EffectComposer.js';
import { RenderPass } from './vendor/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './vendor/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from './vendor/addons/postprocessing/OutputPass.js';

const section = document.getElementById('garage');
const canvas = document.getElementById('garageCanvas');
const captions = [...document.querySelectorAll('.g-cap')];
const intro = document.getElementById('gIntro');
const bar = document.getElementById('gBar');
const mobile = matchMedia('(max-width: 760px)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Parcours caméra : une étape par légende ─── */
const STOPS = [
  { pos: [0, 2.3, 14],      look: [0, 1.5, 0] },      // dehors, porte ouverte
  { pos: [0, 1.9, 8],       look: [0, 1.3, -1] },     // on entre
  { pos: [-3.3, 1.35, 5.4], look: [-3.0, 0.55, 0.3] },// la BRZ (3/4 avant)
  { pos: [-7.1, 0.85, 3.4], look: [-3.0, 0.6, 0.2] }, // profil BRZ
  { pos: [-4.8, 1.6, -1.6], look: [-7.9, 1.4, -1.8] },// l'atelier
  { pos: [0, 1.7, -0.5],    look: [0, 2.6, -6] },     // néon EVS
  { pos: [2.3, 1.05, 2.9],  look: [3.3, 0.6, 0.6] },  // la KTM
  { pos: [3.2, 1.6, 3.5],   look: [4.2, 1.35, 1.9] }, // le pilote
  { pos: [0.5, 3.4, 8.5],   look: [0, 1, -1.5] },     // vue d'ensemble
];

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
} catch (e) {
  section.classList.add('no-webgl');
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x040405);
scene.fog = new THREE.Fog(0x040405, 18, 34);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

const camera = new THREE.PerspectiveCamera(mobile ? 62 : 50, 1, 0.05, 80);

/* ─── Helpers ─── */
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const std = (color, roughness = 0.6, metalness = 0, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, envMapIntensity: 0.4, ...extra });
const glow = (r, g, b) => new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b) });
function mesh(geo, mat, x = 0, y = 0, z = 0, parent = scene, shadow = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = shadow; m.receiveShadow = true;
  parent.add(m);
  return m;
}
const box = (w, h, d, mat, x, y, z, parent) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent);
const rbox = (w, h, d, r, mat, x, y, z, parent) => mesh(new RoundedBoxGeometry(w, h, d, 3, r), mat, x, y, z, parent);
function tube(a, b, r, mat, parent = scene) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(new THREE.CylinderGeometry(r, r, dir.length(), 12), mat, 0, 0, 0, parent);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(V(0, 1, 0), dir.normalize());
  return m;
}
function extrude(points, depth, mat, parent, bevel = 0.04) {
  const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 16 });
  geo.translate(0, 0, -depth / 2);
  return mesh(geo, mat, 0, 0, 0, parent);
}
function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}
// resserre une géométrie vers le haut (carrosserie plus galbée)
function taper(geo, y0, y1, k) {
  const a = geo.attributes.position;
  for (let i = 0; i < a.count; i++) {
    const t = Math.min(1, Math.max(0, (a.getY(i) - y0) / (y1 - y0)));
    a.setZ(i, a.getZ(i) * (1 - k * t));
  }
  geo.computeVertexNormals();
  return geo;
}
const rand = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

/* ─── Textures procédurales ─── */
const concrete = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#2b2b2e'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 9000; i++) {
    const v = 30 + rand() * 30 | 0;
    g.fillStyle = `rgba(${v},${v},${v + 3},${0.25 + rand() * 0.4})`;
    g.fillRect(rand() * w, rand() * h, 1 + rand() * 3, 1 + rand() * 3);
  }
}, [6, 2]);

const floorTex = canvasTex(1024, 1024, (g, w, h) => {
  const n = 8, s = w / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const v = 22 + rand() * 8 | 0;
    g.fillStyle = `rgb(${v},${v},${v + 2})`; g.fillRect(i * s, j * s, s, s);
  }
  g.strokeStyle = '#0b0b0c'; g.lineWidth = 4;
  for (let i = 0; i <= n; i++) {
    g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, h); g.stroke();
    g.beginPath(); g.moveTo(0, i * s); g.lineTo(w, i * s); g.stroke();
  }
}, [2.5, 2]);

const pegboard = canvasTex(1024, 512, (g, w, h) => {
  g.fillStyle = '#18181a'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#0a0a0b';
  for (let x = 12; x < w; x += 24) for (let y = 12; y < h; y += 24) { g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); }
  // silhouettes d'outils
  const tool = (x, y, len, ang, kind) => {
    g.save(); g.translate(x, y); g.rotate(ang);
    g.fillStyle = '#c9ccd1'; g.strokeStyle = '#e3171b'; g.lineWidth = 3;
    if (kind === 'wrench') {
      g.fillRect(-6, 0, 12, len);
      g.beginPath(); g.arc(0, 0, 14, 0, 7); g.fill();
      g.beginPath(); g.arc(0, len, 12, 0, 7); g.fill();
      g.fillStyle = '#18181a'; g.fillRect(-5, -16, 10, 12);
    } else if (kind === 'driver') {
      g.fillStyle = '#e3171b'; g.fillRect(-9, 0, 18, len * 0.4);
      g.fillStyle = '#c9ccd1'; g.fillRect(-3, len * 0.4, 6, len * 0.6);
    } else {
      g.fillStyle = '#3a3a3e'; g.fillRect(-5, 0, 10, len);
      g.fillStyle = '#c9ccd1'; g.fillRect(-28, -10, 56, 22);
    }
    g.restore();
  };
  for (let i = 0; i < 9; i++) tool(60 + i * 46, 70, 120 + i * 9, 0, 'wrench');
  for (let i = 0; i < 6; i++) tool(520 + i * 40, 60, 150, 0, 'driver');
  for (let i = 0; i < 3; i++) tool(820 + i * 70, 70, 140, 0, 'hammer');
  for (let i = 0; i < 10; i++) tool(80 + i * 60, 300, 110, 0.15, i % 2 ? 'driver' : 'wrench');
  g.fillStyle = '#e3171b'; g.fillRect(700, 300, 280, 160);
  g.fillStyle = '#fff'; g.font = 'bold 56px Anton, Impact, sans-serif'; g.textAlign = 'center';
  g.fillText('EVS', 840, 375); g.font = 'bold 26px Inter, sans-serif'; g.fillText('PIT CREW', 840, 420);
});

const wallText = canvasTex(2048, 256, (g, w, h) => {
  g.clearRect(0, 0, w, h);
  g.font = '170px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = 'rgba(244,242,238,.9)'; g.fillText('EVIL SHARK CREW · 974', w / 2, h / 2 + 8);
});

const plateTex = canvasTex(512, 128, (g, w, h) => {
  g.fillStyle = '#f4f2ee'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#1d3f9c'; g.fillRect(0, 0, 50, h); g.fillRect(w - 50, 0, 50, h);
  g.fillStyle = '#111'; g.font = 'bold 84px Inter, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('EVS-974', w / 2, h / 2 + 4);
});

const logoTex = new THREE.TextureLoader().load('img/evs-logo.webp', () => { needsRender = true; });
logoTex.colorSpace = THREE.SRGBColorSpace;

/* ─── Le garage ─── */
const RW = 16, RD = 12, RH = 4.5;
const wallMat = std(0xffffff, 0.92, 0, { map: concrete });
box(RW, RH, 0.2, wallMat, 0, RH / 2, -RD / 2 - 0.1);                 // fond
box(0.2, RH, RD, wallMat, -RW / 2 - 0.1, RH / 2, 0);                 // gauche
box(0.2, RH, RD, wallMat, RW / 2 + 0.1, RH / 2, 0);                  // droite
box(RW, 0.2, RD, std(0x141416, 0.9), 0, RH + 0.1, 0);                 // plafond
// façade avec ouverture de porte (6 m x 3.4 m)
box(5, RH, 0.3, wallMat, -5.5, RH / 2, RD / 2);
box(5, RH, 0.3, wallMat, 5.5, RH / 2, RD / 2);
box(6, RH - 3.4, 0.3, wallMat, 0, 3.4 + (RH - 3.4) / 2, RD / 2);
// porte roulante enroulée + cadre lumineux rouge
mesh(new THREE.CylinderGeometry(0.28, 0.28, 6.2, 24), std(0x3a3b3f, 0.4, 0.8), 0, 3.15, RD / 2 - 0.35).rotation.z = Math.PI / 2;
const red = glow(2.2, 0.12, 0.12);
box(6.1, 0.05, 0.05, red, 0, 3.42, RD / 2 + 0.16);
box(0.05, 3.4, 0.05, red, -3.03, 1.7, RD / 2 + 0.16);
box(0.05, 3.4, 0.05, red, 3.03, 1.7, RD / 2 + 0.16);

// sol : vraie réflexion (desktop) + carrelage époxy par-dessus
if (!mobile) {
  const refl = new Reflector(new THREE.PlaneGeometry(RW, RD), {
    textureWidth: innerWidth * 0.5, textureHeight: innerHeight * 0.5, color: 0x8a8a8a, clipBias: 0.003,
  });
  refl.rotation.x = -Math.PI / 2;
  scene.add(refl);
}
const floor = mesh(new THREE.PlaneGeometry(RW, RD),
  std(0xffffff, mobile ? 0.25 : 0.35, 0.1, { map: floorTex, transparent: !mobile, opacity: 0.8, envMapIntensity: 0.6 }), 0, 0.004, 0, scene, false);
floor.rotation.x = -Math.PI / 2;
// dehors : asphalte mouillé
const outside = mesh(new THREE.PlaneGeometry(30, 14), std(0x0d0d0f, 0.3, 0.2), 0, -0.01, RD / 2 + 7, scene, false);
outside.rotation.x = -Math.PI / 2;
box(6, 0.02, 0.12, std(0x6b5800, 0.6), 0, 0.005, RD / 2 + 1.5);

// plafond : grille LED hexagonale
{
  const R = 0.62, bars = [];
  const hw = R * Math.sqrt(3);
  for (let row = -4; row <= 4; row++) for (let col = -5; col <= 5; col++) {
    const cx = col * hw + (row % 2 ? hw / 2 : 0), cz = row * R * 1.5;
    if (Math.abs(cx) > 6.6 || Math.abs(cz) > 4.8) continue;
    for (let k = 0; k < 6; k++) {
      const a = Math.PI / 6 + k * Math.PI / 3;
      bars.push([cx + Math.cos(a) * R * 0.866, cz + Math.sin(a) * R * 0.866, a + Math.PI / 2]);
    }
  }
  const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(R, 0.03, 0.05), glow(1.6, 1.6, 1.7), bars.length);
  const o = new THREE.Object3D();
  bars.forEach(([x, z, r], i) => { o.position.set(x, RH - 0.06, z); o.rotation.set(0, -r, 0); o.updateMatrix(); inst.setMatrixAt(i, o.matrix); });
  scene.add(inst);
}

// bandeau LED rouge le long des murs
box(RW - 0.4, 0.04, 0.04, red, 0, 0.9, -RD / 2 + 0.02);
box(0.04, 0.04, RD - 1, red, -RW / 2 + 0.02, 0.9, -0.5);
box(0.04, 0.04, RD - 1, red, RW / 2 - 0.02, 0.9, -0.5);

// néon EVS sur le mur du fond
rbox(5, 2.7, 0.08, 0.04, std(0x0c0c0d, 0.35, 0.6), 0, 2.7, -RD / 2 + 0.05);
const neon = mesh(new THREE.PlaneGeometry(4.4, 2.2),
  new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, color: new THREE.Color(1.5, 1.5, 1.5) }), 0, 2.7, -RD / 2 + 0.11, scene, false);
const neonLight = new THREE.PointLight(0xff2a2a, 10, 9, 2);
neonLight.position.set(0, 2.6, -4.6);
scene.add(neonLight);

// texte peint mur droit
const txt = mesh(new THREE.PlaneGeometry(7, 0.875), new THREE.MeshBasicMaterial({ map: wallText, transparent: true, color: 0xbbbbbb }), RW / 2 - 0.02, 3.4, -1.2, scene, false);
txt.rotation.y = -Math.PI / 2;

/* ─── L'atelier (mur gauche) ─── */
const peg = mesh(new THREE.PlaneGeometry(5.6, 2.8), std(0xffffff, 0.7, 0, { map: pegboard }), -RW / 2 + 0.02, 2.05, -1.6, scene, false);
peg.rotation.y = Math.PI / 2;
// servante rouge
{
  const g = new THREE.Group(); g.position.set(-7.35, 0, -3.3); g.rotation.y = Math.PI / 2; scene.add(g);
  const redPaint = new THREE.MeshPhysicalMaterial({ color: 0xc8141a, roughness: 0.25, metalness: 0.4, clearcoat: 1, envMapIntensity: 0.8 });
  rbox(1.4, 1.0, 0.6, 0.03, redPaint, 0, 0.6, 0, g);
  for (let i = 0; i < 6; i++) {
    box(1.32, 0.012, 0.01, std(0x111111), 0, 0.2 + i * 0.15, 0.302, g);
    box(0.5, 0.025, 0.03, std(0xdddddd, 0.2, 1), 0, 0.26 + i * 0.15, 0.32, g);
  }
  box(1.44, 0.04, 0.64, std(0x222224, 0.4, 0.8), 0, 1.12, 0, g);
  rbox(1.4, 0.45, 0.5, 0.03, redPaint, 0, 1.37, -0.05, g);
  for (const x of [-0.6, 0.6]) for (const z of [-0.22, 0.22]) mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 12), std(0x111111), x, 0.05, z, g).rotation.x = Math.PI / 2;
}
// établi
{
  const g = new THREE.Group(); g.position.set(-7.4, 0, -0.4); g.rotation.y = Math.PI / 2; scene.add(g);
  box(2.4, 0.07, 0.8, std(0x6b4a2b, 0.7), 0, 0.95, 0, g);
  const steel = std(0x2a2b2e, 0.4, 0.8);
  for (const x of [-1.1, 1.1]) for (const z of [-0.33, 0.33]) box(0.06, 0.92, 0.06, steel, x, 0.46, z, g);
  box(2.3, 0.04, 0.72, steel, 0, 0.25, 0, g);
  // étau + caisse à outils
  box(0.25, 0.14, 0.18, std(0x2147a8, 0.4, 0.5), -0.7, 1.06, 0.2, g);
  rbox(0.55, 0.25, 0.28, 0.02, std(0xc8141a, 0.35, 0.3), 0.5, 1.11, 0, g);
  // casque posé sur l'établi
  mesh(new THREE.SphereGeometry(0.15, 32, 16), std(0x1a1a1c, 0.25, 0.4), -0.1, 1.13, 0, g);
}

/* ─── Racks et étagères (mur droit) ─── */
{
  const steel = std(0x2a2b2e, 0.45, 0.8);
  const tire = std(0x0e0e0f, 0.85);
  const rim = std(0x9a9ca1, 0.25, 1);
  // rack à pneus
  for (const x of [-0.5, 0.5]) for (const z of [-1.2, 1.2]) box(0.05, 2.2, 0.05, steel, 7.4 + x * 0.6, 1.1, -2.6 + z);
  for (const y of [0.55, 1.45]) {
    box(0.65, 0.04, 2.5, steel, 7.4, y - 0.36, -2.6);
    for (let i = 0; i < 3; i++) {
      const t = mesh(new THREE.TorusGeometry(0.24, 0.1, 16, 32), tire, 7.4, y, -3.4 + i * 0.8);
      const r = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.16, 24), rim, 7.4, y, -3.4 + i * 0.8);
      t.rotation.y = Math.PI / 2; r.rotation.z = Math.PI / 2;
    }
  }
  // étagère : bidons + casques
  for (const y of [0.6, 1.3, 2.0]) box(0.5, 0.04, 2.2, steel, 7.6, y, 1.6);
  for (const z of [0.5, 2.7]) box(0.04, 2.1, 0.04, steel, 7.85, 1.05, z);
  const cans = [0xe3171b, 0x111111, 0xf28c00, 0x2147a8, 0xdddddd];
  for (let i = 0; i < 7; i++) mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.28, 16), std(cans[i % 5], 0.35, 0.3), 7.6, 0.76, 0.7 + i * 0.28);
  for (let i = 0; i < 3; i++) mesh(new THREE.SphereGeometry(0.16, 32, 16), std([0x777a80, 0x111111, 0xe3171b][i], 0.25, 0.4), 7.6, 1.48, 0.9 + i * 0.7);
  for (let i = 0; i < 4; i++) rbox(0.36, 0.3, 0.4, 0.02, std(0x1c1c1e, 0.6), 7.6, 2.17, 0.8 + i * 0.5);
}
// cric rouge au sol
{
  const g = new THREE.Group(); g.position.set(-1.2, 0, -3.6); g.rotation.y = 0.5; scene.add(g);
  box(0.4, 0.12, 0.9, std(0xc8141a, 0.35, 0.4), 0, 0.1, 0, g);
  tube(V(0, 0.15, -0.4), V(0, 0.9, -1.3), 0.025, std(0x222222, 0.4, 0.8), g);
}

/* ─── Subaru BRZ ─── */
const paint = new THREE.MeshPhysicalMaterial({ color: 0x1d4fbf, roughness: 0.32, metalness: 0.55, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.1 });
{
  const car = new THREE.Group(); car.position.set(-3.1, 0, 0.3); car.rotation.y = -0.927; scene.add(car);
  // carrosserie (profil latéral extrudé)
  const s = new THREE.Shape();
  s.moveTo(-2.08, 0.3);
  s.lineTo(-1.72, 0.3); s.absarc(-1.28, 0.32, 0.44, Math.PI, 0, true);
  s.lineTo(0.85, 0.3); s.absarc(1.29, 0.32, 0.44, Math.PI, 0, true);
  s.lineTo(2.05, 0.28);
  s.bezierCurveTo(2.18, 0.34, 2.18, 0.52, 2.12, 0.62);
  s.bezierCurveTo(1.9, 0.72, 1.4, 0.8, 0.75, 0.86);
  s.lineTo(-1.35, 0.92);
  s.bezierCurveTo(-1.7, 0.94, -1.95, 0.96, -2.1, 0.95);
  s.bezierCurveTo(-2.18, 0.85, -2.18, 0.5, -2.08, 0.3);
  const bodyGeo = new THREE.ExtrudeGeometry(s, { depth: 1.58, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.08, bevelSegments: 6, curveSegments: 24 });
  bodyGeo.translate(0, 0, -0.79);
  taper(bodyGeo, 0.55, 1.05, 0.1);
  mesh(bodyGeo, paint, 0, 0, 0, car);
  // habitacle vitré + toit
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x050608, roughness: 0.05, metalness: 0.9, envMapIntensity: 1.4 });
  taper(extrude([[0.78, 0.86], [0.42, 1.08], [0.02, 1.25], [-0.72, 1.25], [-1.18, 1.1], [-1.55, 0.93]], 1.3, glass, car, 0.08).geometry, 0.86, 1.33, 0.3);
  extrude([[0.0, 1.33], [-0.7, 1.33], [-0.82, 1.3], [0.1, 1.3]], 0.86, paint, car, 0.06);
  // calandre, phares, feux
  rbox(0.06, 0.1, 0.7, 0.03, std(0x070707, 0.5), 2.22, 0.4, 0, car);
  for (const z of [-0.6, 0.6]) {
    const hl = rbox(0.16, 0.07, 0.32, 0.03, glow(3, 3, 3.3), 2.13, 0.6, z, car); hl.rotation.y = z > 0 ? 0.35 : -0.35;
    rbox(0.06, 0.08, 0.36, 0.03, glow(5, 0.15, 0.15), -2.25, 0.8, z * 1.02, car);
  }
  box(0.02, 0.025, 0.9, glow(4, 0.1, 0.1), -2.27, 0.84, 0, car);
  const plate = mesh(new THREE.PlaneGeometry(0.5, 0.12), new THREE.MeshStandardMaterial({ map: plateTex, roughness: 0.4 }), 2.25, 0.36, 0, car, false);
  plate.rotation.y = Math.PI / 2;
  // rétroviseurs, aileron, échappements
  for (const z of [-0.88, 0.88]) rbox(0.18, 0.1, 0.14, 0.03, paint, 0.62, 0.98, z, car);
  rbox(0.18, 0.03, 1.4, 0.01, std(0x0a0a0a, 0.4), -2.02, 1.06, 0, car);
  for (const z of [-0.45, 0.45]) mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.12, 16), std(0xb8bbc0, 0.2, 1), -2.2, 0.27, z, car).rotation.z = Math.PI / 2;
  // roues : pneu, jante 5 branches, étrier rouge
  const tireMat = std(0x0c0c0d, 0.9);
  const rimMat = std(0x16171a, 0.25, 1, { envMapIntensity: 1 });
  for (const x of [-1.28, 1.29]) for (const z of [-0.78, 0.78]) {
    const w = new THREE.Group(); w.position.set(x, 0.32, z); car.add(w);
    mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.23, 32), tireMat, 0, 0, 0, w).rotation.x = Math.PI / 2;
    const out = Math.sign(z) * 0.118;
    mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 32), rimMat, 0, 0, out, w).rotation.x = Math.PI / 2;
    for (let k = 0; k < 5; k++) {
      const sp = box(0.04, 0.2, 0.025, rimMat, 0, 0, out * 1.08, w);
      sp.rotation.z = k * Math.PI * 2 / 5; sp.translateY(0.1);
    }
    box(0.12, 0.08, 0.05, std(0xc8141a, 0.4, 0.3), 0.12, 0.12, out * 0.6, w);
  }
  car.traverse(o => { if (o.isMesh) o.castShadow = true; });
}

/* ─── KTM 990 Duke ─── */
{
  const bike = new THREE.Group(); bike.position.set(3.2, 0, 0.4); bike.rotation.y = -2.214; scene.add(bike);
  const lean = new THREE.Group(); lean.rotation.x = -0.12; bike.add(lean);
  const black = std(0x0d0d0f, 0.3, 0.4, { envMapIntensity: 0.9 });
  const orange = new THREE.MeshPhysicalMaterial({ color: 0xff6a00, roughness: 0.3, metalness: 0.2, clearcoat: 1, envMapIntensity: 0.9 });
  const metal = std(0x8d9096, 0.3, 1, { envMapIntensity: 1 });
  const gold = std(0xc99a2e, 0.25, 1, { envMapIntensity: 1 });
  const tireMat = std(0x0c0c0d, 0.9);
  const wheel = (x, w) => {
    const g = new THREE.Group(); g.position.set(x, 0.31, 0); lean.add(g);
    mesh(new THREE.TorusGeometry(0.255, w, 16, 48), tireMat, 0, 0, 0, g);
    mesh(new THREE.CylinderGeometry(0.22, 0.22, w * 1.2, 32), black, 0, 0, 0, g).rotation.x = Math.PI / 2;
    for (let k = 0; k < 6; k++) { const sp = box(0.03, 0.2, 0.03, orange, 0, 0, w * 0.65, g); sp.rotation.z = k * Math.PI / 3; sp.translateY(0.1); }
    mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.01, 32), metal, 0, 0, -w * 0.7, g).rotation.x = Math.PI / 2;
  };
  wheel(0.74, 0.06); wheel(-0.72, 0.085);
  // fourche dorée
  for (const z of [-0.1, 0.1]) tube(V(0.74, 0.31, z), V(0.5, 0.98, z * 0.9), 0.025, gold, lean);
  // phare à LED en V (signature de la Duke)
  rbox(0.12, 0.22, 0.2, 0.03, black, 0.6, 0.98, 0, lean);
  for (const z of [-0.05, 0.05]) {
    const l = box(0.02, 0.15, 0.015, glow(4, 4, 4.4), 0.665, 0.99, z, lean); l.rotation.x = z > 0 ? 0.45 : -0.45;
  }
  // réservoir + caches orange
  extrude([[0.45, 0.98], [0.32, 1.12], [0.0, 1.13], [-0.18, 1.04], [-0.2, 0.86], [0.36, 0.82]], 0.34, black, lean, 0.05);
  for (const z of [-0.2, 0.2]) { const p = rbox(0.26, 0.16, 0.03, 0.02, orange, 0.36, 0.86, z, lean); p.rotation.z = -0.3; }
  // selle + coque arrière
  extrude([[-0.16, 0.95], [-0.62, 0.98], [-0.62, 0.92], [-0.16, 0.88]], 0.26, std(0x1a1a1c, 0.8), lean, 0.03);
  extrude([[-0.6, 0.94], [-0.95, 1.08], [-0.98, 1.04], [-0.62, 0.86]], 0.18, black, lean, 0.03);
  box(0.03, 0.03, 0.12, glow(4, 0.1, 0.1), -0.98, 1.05, 0, lean);
  // cadre et bras oscillant
  const frame = std(0x1b1b1d, 0.35, 0.7);
  for (const z of [-0.12, 0.12]) {
    tube(V(0.5, 0.95, z), V(-0.22, 0.62, z), 0.022, frame, lean);
    tube(V(0.45, 0.92, z), V(0.1, 0.55, z), 0.018, frame, lean);
    tube(V(-0.22, 0.55, z), V(-0.72, 0.31, z * 1.1), 0.028, orange, lean);
  }
  // moteur LC8c
  rbox(0.46, 0.36, 0.3, 0.04, std(0x2e3034, 0.4, 0.8), 0.06, 0.52, 0, lean);
  for (let i = 0; i < 4; i++) box(0.3, 0.012, 0.32, metal, 0.12, 0.62 + i * 0.03, 0, lean);
  mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 24), std(0xff6a00, 0.4, 0.4), 0.0, 0.48, 0.17, lean).rotation.x = Math.PI / 2;
  // échappement IXIL
  tube(V(0.12, 0.36, 0.08), V(-0.25, 0.3, 0.16), 0.03, metal, lean);
  tube(V(-0.22, 0.31, 0.17), V(-0.55, 0.42, 0.2), 0.055, std(0xa9acb2, 0.22, 1, { envMapIntensity: 1.2 }), lean);
  // guidon, leviers orange, rétros
  tube(V(0.4, 1.12, -0.38), V(0.4, 1.12, 0.38), 0.014, black, lean);
  for (const z of [-1, 1]) {
    tube(V(0.42, 1.11, z * 0.3), V(0.5, 1.1, z * 0.44), 0.008, orange, lean);
    tube(V(0.38, 1.13, z * 0.32), V(0.36, 1.32, z * 0.38), 0.008, black, lean);
    rbox(0.03, 0.08, 0.14, 0.02, black, 0.36, 1.34, z * 0.4, lean);
  }
  // béquille
  tube(V(-0.1, 0.45, -0.14), V(-0.18, 0.02, -0.3), 0.012, frame, bike);
}

/* ─── Le pilote (casque KYT, tee EVS) ─── */
{
  const rider = new THREE.Group(); rider.position.set(4.3, 0, 1.9); rider.rotation.y = -0.84; scene.add(rider);
  const fabric = std(0x0b0b0c, 0.95);
  const pants = std(0x151517, 0.9);
  const helmet = std(0x45484d, 0.55, 0.3, { envMapIntensity: 0.6 });
  // casque
  const head = new THREE.Group(); head.position.set(0, 1.66, 0); rider.add(head);
  const shell = mesh(new THREE.SphereGeometry(0.16, 48, 32), helmet, 0, 0, 0, head); shell.scale.set(0.95, 1.05, 1.12);
  const visor = mesh(new THREE.SphereGeometry(0.165, 48, 16, Math.PI / 2 - 0.95, 1.9, 1.2, 0.55),
    new THREE.MeshPhysicalMaterial({ color: 0x050505, roughness: 0.04, metalness: 1, iridescence: 0.35, iridescenceIOR: 1.3, envMapIntensity: 1.2 }), 0, 0, 0, head);
  visor.scale.set(0.95, 1.05, 1.12);
  box(0.05, 0.08, 0.02, std(0x111111, 0.5), 0.15, -0.03, -0.02, head);  // intercom
  // corps
  mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.1, 16), fabric, 0, 1.5, 0, rider);
  rbox(0.46, 0.6, 0.26, 0.09, fabric, 0, 1.2, 0, rider);
  mesh(new THREE.PlaneGeometry(0.16, 0.08), new THREE.MeshBasicMaterial({ map: logoTex, transparent: true }), 0.1, 1.36, 0.131, rider, false);
  // bras
  for (const x of [-1, 1]) {
    const arm = mesh(new THREE.CapsuleGeometry(0.055, 0.5, 6, 12), fabric, x * 0.29, 1.13, 0, rider); arm.rotation.z = x * 0.12;
    mesh(new THREE.SphereGeometry(0.055, 16, 12), fabric, x * 0.33, 0.82, 0.01, rider);
  }
  // jambes + bottes
  rbox(0.38, 0.2, 0.25, 0.06, pants, 0, 0.88, 0, rider);
  for (const x of [-0.1, 0.1]) {
    mesh(new THREE.CapsuleGeometry(0.075, 0.62, 6, 12), pants, x, 0.48, 0, rider);
    rbox(0.13, 0.13, 0.3, 0.04, std(0x070707, 0.5), x, 0.065, 0.04, rider);
  }
}

/* ─── Lumières ─── */
scene.add(new THREE.HemisphereLight(0x9aa4b5, 0x111111, 0.2));
function spot(x, z, tx, tz, intensity) {
  const l = new THREE.SpotLight(0xffffff, intensity, 14, 0.62, 0.7, 2);
  l.position.set(x, RH - 0.2, z);
  l.target.position.set(tx, 0, tz);
  l.castShadow = true;
  l.shadow.mapSize.set(mobile ? 512 : 1024, mobile ? 512 : 1024);
  l.shadow.bias = -0.0004;
  scene.add(l, l.target);
}
spot(-3.1, 1.5, -3.1, 0.3, 55);
spot(3.4, 1.6, 3.5, 0.8, 55);
const fill = new THREE.PointLight(0xffffff, 5, 12, 2); fill.position.set(0, 3.4, 3); scene.add(fill);
const doorLight = new THREE.PointLight(0xff3030, 3, 6, 2); doorLight.position.set(0, 3, RD / 2 + 0.8); scene.add(doorLight);

/* ─── Post-traitement : bloom pour les néons ─── */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), mobile ? 0.35 : 0.45, 0.3, 0.98);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* ─── Scroll → caméra ─── */
const posCurve = new THREE.CatmullRomCurve3(STOPS.map(s => V(...s.pos)), false, 'centripetal');
const lookCurve = new THREE.CatmullRomCurve3(STOPS.map(s => V(...s.look)), false, 'centripetal');
const N = STOPS.length - 1;
let target = 0, current = 0, needsRender = true, visible = true;

function progress() {
  const r = section.getBoundingClientRect();
  return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight || 1)));
}
function onScroll() {
  const p = progress();
  // on ralentit autour de chaque étape pour laisser le temps de regarder
  const raw = p * N, i = Math.min(N - 1, Math.floor(raw)), f = raw - i;
  const eased = f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2;
  target = (i + eased) / N;
  bar.style.height = `${p * 100}%`;
  intro.style.opacity = 1 - Math.min(1, raw / 0.45);
  intro.style.transform = `translateY(${-raw * 40}px)`;
  captions.forEach((c, k) => {
    const d = Math.abs(raw - (k + 1));
    const o = Math.max(0, 1 - d / 0.38);
    c.style.opacity = o;
    c.style.transform = `translateY(${(raw - (k + 1)) * -40}px)`;
    c.classList.toggle('on', o > 0.5);
  });
  needsRender = true;
}
addEventListener('scroll', onScroll, { passive: true });

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  needsRender = true;
}
addEventListener('resize', resize);
new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(section);

// couleurs de la BRZ
document.querySelectorAll('[data-paint]').forEach(b => b.addEventListener('click', () => {
  paint.color.set(b.dataset.paint);
  document.querySelectorAll('[data-paint]').forEach(x => x.classList.toggle('on', x === b));
  needsRender = true;
}));

const clock = new THREE.Clock();
const look = new THREE.Vector3();
function frame() {
  requestAnimationFrame(frame);
  if (!visible) return;
  const t = clock.elapsedTime;
  const dt = Math.min(0.1, clock.getDelta());
  const moving = Math.abs(target - current) > 0.00005;
  current += (target - current) * (reduced ? 1 : 1 - Math.exp(-dt * 4.5));
  // néon qui grésille à l'allumage puis respire doucement
  const flick = t < 1.6 ? (Math.sin(t * 40) > 0.2 ? 1 : 0.15) : 0.92 + Math.sin(t * 2) * 0.08;
  neon.material.color.setScalar(1.5 * flick);
  neonLight.intensity = 10 * flick;
  if (!moving && !needsRender && t > 1.8 && Math.floor(t * 30) % 2) return;
  camera.position.copy(posCurve.getPoint(current));
  // léger flottement de la caméra
  if (!reduced) camera.position.y += Math.sin(t * 0.8) * 0.02;
  look.copy(lookCurve.getPoint(current));
  camera.lookAt(look);
  composer.render();
  needsRender = false;
  if (!section.classList.contains('ready')) section.classList.add('ready');
}
resize(); onScroll(); current = target; frame();
