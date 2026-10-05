import * as THREE from 'three';
import { useEffect, useState } from 'react';

export const YELLOW = '#ffd400';
const FONT = '"Archivo", "Arial Narrow", Arial, sans-serif';

type Ctx = CanvasRenderingContext2D;
type Draw = (ctx: Ctx, w: number, h: number) => void;

export interface SceneTextures {
  sign: THREE.CanvasTexture;
  dtfFilm: THREE.CanvasTexture;
  dtfPrint: THREE.CanvasTexture;
  shopFilm: THREE.CanvasTexture;
  frost: THREE.CanvasTexture;
  billboard: THREE.CanvasTexture;
  label: THREE.CanvasTexture;
  labelStrip: THREE.CanvasTexture;
  monitor: THREE.CanvasTexture;
  logoMark: THREE.CanvasTexture;
  rollup: THREE.CanvasTexture;
  meshBanner: THREE.CanvasTexture;
  flag: THREE.CanvasTexture;
  exitGlow: THREE.CanvasTexture;
  banners: THREE.CanvasTexture[];
  posters: THREE.CanvasTexture[];
}

function make(w: number, h: number, draw: Draw, repeat = false): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  if (repeat) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
  }
  tex.needsUpdate = true;
  return tex;
}

function font(ctx: Ctx, weight: number, size: number): void {
  ctx.font = `${weight} ${size}px ${FONT}`;
}

function text(ctx: Ctx, value: string, x: number, y: number, maxWidth?: number): void {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (maxWidth) ctx.fillText(value, x, y, maxWidth);
  else ctx.fillText(value, x, y);
}

function circle(ctx: Ctx, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Színes, tintasugaras jellegű minta-grafika a DTF filmre és a pólóra. */
function drawPrintGraphic(ctx: Ctx, cx: number, cy: number, size: number): void {
  const r = size * 0.3;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = YELLOW;
  circle(ctx, -r * 0.5, -r * 0.25, r);
  ctx.fillStyle = '#e6007e';
  circle(ctx, r * 0.5, -r * 0.25, r);
  ctx.fillStyle = '#00a0e3';
  circle(ctx, 0, r * 0.55, r);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#ffffff';
  font(ctx, 900, size * 0.26);
  text(ctx, 'DTF', 0, size * 0.05);
  ctx.restore();
}

/** Semleges minta-jelzés: sárga négyzet fekete V formával (a végleges logóra cserélhető). */
function drawMark(ctx: Ctx, x: number, y: number, s: number): void {
  ctx.fillStyle = YELLOW;
  roundRect(ctx, x, y, s, s, s * 0.06);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(x + s * 0.2, y + s * 0.24);
  ctx.lineTo(x + s * 0.36, y + s * 0.24);
  ctx.lineTo(x + s * 0.5, y + s * 0.6);
  ctx.lineTo(x + s * 0.64, y + s * 0.24);
  ctx.lineTo(x + s * 0.8, y + s * 0.24);
  ctx.lineTo(x + s * 0.57, y + s * 0.78);
  ctx.lineTo(x + s * 0.43, y + s * 0.78);
  ctx.closePath();
  ctx.fill();
}

function drawLabel(ctx: Ctx, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, x, y, w, h, h * 0.12);
  ctx.fill();
  ctx.save();
  roundRect(ctx, x, y, w, h, h * 0.12);
  ctx.clip();
  ctx.fillStyle = YELLOW;
  ctx.fillRect(x, y, w, h * 0.28);
  ctx.restore();
  ctx.fillStyle = '#000';
  font(ctx, 900, h * 0.3);
  text(ctx, 'AKÁCMÉZ', x + w / 2, y + h * 0.58, w * 0.86);
  font(ctx, 500, h * 0.12);
  text(ctx, 'Nyírségi termelő', x + w / 2, y + h * 0.84, w * 0.8);
}

function banner(label: string, inverted: boolean): THREE.CanvasTexture {
  return make(256, 1024, (ctx, w, h) => {
    ctx.fillStyle = inverted ? '#000' : YELLOW;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = inverted ? YELLOW : '#000';
    ctx.fillRect(0, 0, w, 18);
    ctx.fillRect(0, h - 18, w, 18);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = inverted ? '#fff' : '#000';
    font(ctx, 900, 150);
    text(ctx, label, 0, 0, h - 120);
    ctx.restore();
  });
}

function poster(title: string, line: string): THREE.CanvasTexture {
  return make(512, 720, (ctx, w, h) => {
    ctx.fillStyle = '#f2f2f0';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, h * 0.55, w, h * 0.45);
    ctx.fillStyle = YELLOW;
    circle(ctx, w * 0.7, h * 0.32, w * 0.26);
    ctx.fillStyle = '#000';
    font(ctx, 900, 110);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(title, 36, h * 0.52, w - 72);
    ctx.fillStyle = '#fff';
    font(ctx, 600, 34);
    ctx.fillText(line, 36, h * 0.66, w - 72);
    ctx.fillStyle = YELLOW;
    ctx.fillRect(36, h * 0.9, 120, 10);
  });
}

export function createTextures(): SceneTextures {
  const sign = make(2048, 384, (ctx, w, h) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = YELLOW;
    ctx.fillRect(0, h - 26, w, 26);
    ctx.fillStyle = '#fff';
    font(ctx, 800, 230);
    text(ctx, 'VIZUÁLDEKOR', w / 2, h * 0.47, w - 180);
  });

  const dtfFilm = make(1024, 768, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.fillRect(0, 0, w, h);
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        drawPrintGraphic(ctx, (w / 3) * (col + 0.5), (h / 2) * (row + 0.5), w / 3.4);
      }
    }
  });

  const dtfPrint = make(512, 512, (ctx, w, h) => {
    drawPrintGraphic(ctx, w / 2, h / 2, w);
  });

  const shopFilm = make(1024, 576, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    for (let y = 0; y < 9; y += 1) {
      for (let x = 0; x < 14; x += 1) {
        const r = Math.max(0, 9 - y * 1.1) * (1 - x / 20);
        if (r <= 0.5) continue;
        ctx.fillStyle = YELLOW;
        circle(ctx, 40 + x * 30, h * 0.72 - y * 28, r);
      }
    }
    ctx.fillStyle = YELLOW;
    ctx.fillRect(0, h * 0.78, w, h * 0.22);
    ctx.fillStyle = '#000';
    font(ctx, 900, 78);
    text(ctx, 'MINDEN NAP NYITVA', w / 2, h * 0.89, w - 120);
    ctx.fillStyle = '#fff';
    font(ctx, 800, 120);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('ÚJ SZEZON', w - 50, h * 0.66, w * 0.6);
  });

  const frost = make(512, 512, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(244,246,247,0.6)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (let y = 0; y < h; y += 24) ctx.fillRect(0, y, w, 3);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    font(ctx, 900, 60);
    text(ctx, 'VIZUÁLDEKOR', w / 2, h / 2, w - 60);
    ctx.globalCompositeOperation = 'source-over';
  });

  const billboard = make(1536, 768, (ctx, w, h) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = YELLOW;
    circle(ctx, w * 0.8, h * 0.45, h * 0.42);
    ctx.fillStyle = '#fff';
    font(ctx, 900, 150);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('NAGY FELÜLET.', 80, h * 0.4, w * 0.7);
    ctx.fillText('ÉLES NYOMAT.', 80, h * 0.62, w * 0.7);
    ctx.fillStyle = YELLOW;
    font(ctx, 700, 46);
    ctx.fillText('BÉRNYOMTATÁS AKÁR 160 CM SZÉLESSÉGBEN', 80, h * 0.82, w * 0.75);
  });

  const label = make(512, 320, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    drawLabel(ctx, 8, 8, w - 16, h - 16);
  });

  const labelStrip = make(1024, 160, (ctx, w, h) => {
    ctx.fillStyle = '#e8e4da';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i += 1) drawLabel(ctx, i * 256 + 20, 18, 216, h - 36);
  }, true);

  const monitor = make(1024, 640, (ctx, w, h) => {
    ctx.fillStyle = '#1c1c1c';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, w, 36);
    ctx.fillRect(0, 36, 64, h);
    ctx.fillRect(w - 200, 36, 200, h);
    ctx.fillStyle = '#3a3a3a';
    for (let i = 0; i < 9; i += 1) ctx.fillRect(16, 60 + i * 52, 32, 32);
    for (let i = 0; i < 7; i += 1) ctx.fillRect(w - 180, 60 + i * 40, 160, 18);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(140, 80, 620, 500);
    drawMark(ctx, 330, 150, 240);
    ctx.fillStyle = '#000';
    font(ctx, 800, 44);
    text(ctx, 'ARCULAT', 450, 470);
    ctx.fillStyle = '#bdbdbd';
    ctx.fillRect(330, 510, 240, 10);
    ctx.fillStyle = YELLOW;
    ctx.fillRect(w - 180, 360, 160, 18);
  });

  const logoMark = make(512, 512, (ctx, w) => {
    ctx.clearRect(0, 0, w, w);
    drawMark(ctx, 16, 16, w - 32);
  });

  const rollup = make(256, 640, (ctx, w, h) => {
    ctx.fillStyle = '#f2f2f0';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, h * 0.6, w, h * 0.4);
    drawMark(ctx, w * 0.25, h * 0.12, w * 0.5);
    ctx.fillStyle = '#000';
    font(ctx, 900, 56);
    text(ctx, 'ROLLUP', w / 2, h * 0.5, w - 30);
    ctx.fillStyle = YELLOW;
    ctx.fillRect(30, h * 0.72, w - 60, 12);
    ctx.fillStyle = '#fff';
    font(ctx, 600, 24);
    text(ctx, 'Rendezvényre, üzletbe', w / 2, h * 0.82, w - 40);
  });

  const meshBanner = make(512, 320, (ctx, w, h) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = YELLOW;
    font(ctx, 900, 92);
    text(ctx, 'MESH HÁLÓ', w / 2, h * 0.45, w - 60);
    ctx.fillStyle = '#fff';
    font(ctx, 600, 30);
    text(ctx, 'Szélálló kültéri nyomat', w / 2, h * 0.72, w - 60);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    for (let y = 4; y < h; y += 8) for (let x = 4; x < w; x += 8) ctx.fillRect(x, y, 2, 2);
  });

  const flag = make(512, 320, (ctx, w, h) => {
    ctx.fillStyle = YELLOW;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, h - 56, w, 56);
    drawMark(ctx, w * 0.36, h * 0.12, h * 0.56);
  });

  const exitGlow = make(512, 512, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.7);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.35, '#fff3b0');
    g.addColorStop(0.75, YELLOW);
    g.addColorStop(1, '#8a7300');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });

  const banners = [
    banner('DEKORÁCIÓ', false),
    banner('NYOMTATÁS', true),
    banner('FÓLIÁZÁS', false),
    banner('DTF', true),
    banner('CÍMKE', false),
    banner('GRAFIKA', true),
  ];

  const posters = [
    poster('POSZTER', 'Beltéri dekoráció'),
    poster('MOLINÓ', 'Kültéri reklámfelület'),
    poster('ZÁSZLÓ', 'Egyedi méretben'),
    poster('TÉRBETŰ', 'Homlokzatra, belső térbe'),
  ];

  return {
    sign,
    dtfFilm,
    dtfPrint,
    shopFilm,
    frost,
    billboard,
    label,
    labelStrip,
    monitor,
    logoMark,
    rollup,
    meshBanner,
    flag,
    exitGlow,
    banners,
    posters,
  };
}

let cache: SceneTextures | null = null;

/** A textúrák a betűtípus betöltése után készülnek el, hogy a feliratok a márka betűjével jelenjenek meg. */
export function useSceneTextures(): SceneTextures | null {
  const [textures, setTextures] = useState<SceneTextures | null>(cache);

  useEffect(() => {
    if (cache) return;
    let alive = true;
    const fontsReady = document.fonts
      ? Promise.all([document.fonts.load(`800 64px ${FONT}`), document.fonts.load(`600 32px ${FONT}`)])
      : Promise.resolve([]);
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 1800));
    Promise.race([fontsReady, timeout])
      .catch(() => undefined)
      .then(() => {
        if (!alive) return;
        cache = cache ?? createTextures();
        setTextures(cache);
      });
    return () => {
      alive = false;
    };
  }, []);

  return textures;
}
