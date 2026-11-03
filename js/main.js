/* ============================================================
   Happy Birthday Firna — main.js
   Semua scene, animasi, surat, dan galeri heart.
   Edit CONFIG di bawah ini untuk mengganti foto & teks.
   ============================================================ */

"use strict";

/* ========================= CONFIG ========================= */

const CONFIG = {
  name: "Firna",

  // Foto isi buku surat: index 0 = halaman "my favorite person",
  // index 1-9 = foto Firna di lembar-lembar berikutnya.
  letterPhotos: [
    "assets/myfavperson.jpeg",
    "assets/firna1.jpeg",
    "assets/firna2.jpeg",
    "assets/firna3.jpeg",
    "assets/firna4.jpeg",
    "assets/firna5.jpeg",
    "assets/firna6.jpeg",
    "assets/firna7.jpeg",
    "assets/firna8.jpeg",
    "assets/firna9.jpeg",
  ],

  // Foto moment kalian (ganti/add sesuai jumlah, minimal 6 untuk heart)
  photos: [
    "assets/1.jpeg",
    "assets/2.jpeg",
    "assets/3.jpeg",
    "assets/4.jpeg",
    "assets/5.jpeg",
    "assets/6.jpeg",
    "assets/7.jpeg",
    "assets/8.jpeg",
    "assets/9.jpeg",
    "assets/10.jpeg",
    "assets/11.jpeg",
    "assets/12.jpeg",
    "assets/us1.jpeg",
    "assets/us2.jpeg",
    "assets/us3.jpeg",
    "assets/us4.jpeg",
    "assets/us5.jpeg",
    "assets/us6.jpeg",
    "assets/us7.jpeg",
    "assets/us8.jpeg",
    "assets/us9.jpeg",
    "assets/us10.jpeg",
    "assets/us11.jpeg",
    "assets/us12.jpeg",
    "assets/new1.jpeg",
    "assets/new2.jpeg",
    "assets/new3.jpeg",
  ],
};

/* ========================= HELPERS ========================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const PINKS = [
  "#e0447e",
  "#f472a0",
  "#ff8fb8",
  "#d6336c",
  "#ffadc6",
  "#c2185b",
];

function makePlaceholder(label, from = "#ffd0e0", to = "#ffb3cd") {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
    `</linearGradient></defs>` +
    `<rect width="200" height="200" fill="url(#g)"/>` +
    `<text x="100" y="108" text-anchor="middle" font-family="cursive" font-size="34" fill="#c2185b" opacity="0.85">${label}</text>` +
    `</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function withFallback(img, label) {
  img.addEventListener("error", function onErr() {
    img.removeEventListener("error", onErr);
    img.src = makePlaceholder(label);
  });
}

/* ========================= LOVE RAIN (gallery ending) ========================= */

const loveRain = {
  canvas: $("#love-rain-canvas"),
  ctx: null,
  hearts: [],
  raf: 0,
  running: false,

  init() {
    this.ctx = this.canvas.getContext("2d");
    window.addEventListener("resize", () => this.resizeIfActive());
  },

  resizeIfActive() {
    if (!this.running) return;
    this.resize();
  },

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = this.canvas.getBoundingClientRect();
    this.canvas.width = r.width * dpr;
    this.canvas.height = r.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = r.width;
    this.h = r.height;
  },

  start() {
    if (this.running) return;
    this.running = true;
    this.resize();
    const n = Math.round(clamp((this.w + this.h) / 14, 28, 62));
    this.hearts = Array.from({ length: n }, () => this.spawn(true));
    this.loop();
  },

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    if (this.ctx && typeof this.w !== "undefined")
      this.ctx.clearRect(0, 0, this.w, this.h);
    this.hearts = [];
  },

  spawn(anywhereY = false) {
    const size = rand(10, 26);
    return {
      x: rand(0, this.w),
      y: anywhereY ? rand(-this.h, 0) : -size * 2,
      s: size,
      vy: rand(1.6, 3.8) * (size / 16),
      sway: rand(0.5, 1.8),
      phase: rand(0, Math.PI * 2),
      spin: rand(-0.025, 0.025),
      rot: rand(-0.6, 0.6),
      alpha: rand(0.5, 0.95),
      color: PINKS[(Math.random() * PINKS.length) | 0],
    };
  },

  heartPath(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.32);
    ctx.bezierCurveTo(
      x + s * 0.56,
      y - s * 0.18,
      x + s * 0.36,
      y - s * 0.58,
      x,
      y - s * 0.2,
    );
    ctx.bezierCurveTo(
      x - s * 0.36,
      y - s * 0.58,
      x - s * 0.56,
      y - s * 0.18,
      x,
      y + s * 0.32,
    );
    ctx.closePath();
  },

  loop() {
    if (!this.running) return;
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);
    for (let i = 0; i < this.hearts.length; i++) {
      const h = this.hearts[i];
      h.y += h.vy;
      h.phase += 0.022;
      h.rot += h.spin;
      const x = h.x + Math.sin(h.phase) * 22 * h.sway;
      if (h.y - h.s > this.h) this.hearts[i] = this.spawn(false);
      ctx.save();
      ctx.translate(x, h.y);
      ctx.rotate(h.rot);
      ctx.globalAlpha = h.alpha;
      ctx.fillStyle = h.color;
      this.heartPath(ctx, 0, 0, h.s);
      ctx.fill();
      ctx.restore();
    }
    this.raf = requestAnimationFrame(() => this.loop());
  },
};

/* ========================= SCENE MANAGER ========================= */

function showScene(id, onDone) {
  const cur = $(".scene.active");
  if (cur) {
    cur.classList.add("leaving");
    setTimeout(() => {
      cur.classList.remove("active", "leaving");
      activateScene(id, onDone);
    }, 420);
  } else {
    activateScene(id, onDone);
  }
}

function activateScene(id, onDone) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("active", "entering");
  setTimeout(() => el.classList.remove("entering"), 620);
  if (onDone) onDone(el);
}

/* ========================= FX CANVAS (confetti) ========================= */

const fx = {
  canvas: $("#fx-canvas"),
  ctx: null,
  parts: [],
  raf: 0,
  dpr: 1,

  init() {
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
  },

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = innerWidth * this.dpr;
    this.canvas.height = innerHeight * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  },

  burst(x, y, count = 60) {
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const sp = rand(3, 11);
      this.parts.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - rand(2, 6),
        g: rand(0.16, 0.3),
        life: 1,
        decay: rand(0.008, 0.016),
        size: rand(5, 11),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.15, 0.15),
        color: PINKS[(Math.random() * PINKS.length) | 0],
        heart: Math.random() < 0.55,
      });
    }
    this.start();
  },

  start() {
    if (!this.raf) this.loop();
  },

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.parts = [];
    this.ctx.clearRect(0, 0, innerWidth, innerHeight);
  },

  heartPath(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.32);
    ctx.bezierCurveTo(
      x + s * 0.56,
      y - s * 0.18,
      x + s * 0.36,
      y - s * 0.58,
      x,
      y - s * 0.2,
    );
    ctx.bezierCurveTo(
      x - s * 0.36,
      y - s * 0.58,
      x - s * 0.56,
      y - s * 0.18,
      x,
      y + s * 0.32,
    );
    ctx.closePath();
  },

  loop() {
    const { ctx } = this;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    this.parts = this.parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
    for (const p of this.parts) {
      p.vy += p.g;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= p.decay;
      ctx.save();
      ctx.globalAlpha = clamp(p.life, 0, 1);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.heart) this.heartPath(ctx, 0, 0, p.size);
      else ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.fill();
      ctx.restore();
    }
    if (this.parts.length) this.raf = requestAnimationFrame(() => this.loop());
    else {
      this.raf = 0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
  },
};

/* ========================= LOVE RAIN (countdown) ========================= */

const rain = {
  canvas: $("#rain-canvas"),
  ctx: null,
  hearts: [],
  raf: 0,
  running: false,

  init() {
    this.ctx = this.canvas.getContext("2d");
    window.addEventListener("resize", () => this.resizeIfActive());
  },

  resizeIfActive() {
    if (!this.running) return;
    this.resize();
  },

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = this.canvas.getBoundingClientRect();
    this.canvas.width = r.width * dpr;
    this.canvas.height = r.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = r.width;
    this.h = r.height;
  },

  start() {
    if (this.running) return;
    this.running = true;
    this.resize();
    const n = Math.round(clamp(this.w / 12, 26, 55));
    this.hearts = Array.from({ length: n }, () => this.spawn(true));
    this.loop();
  },

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    if (this.ctx && this.w) this.ctx.clearRect(0, 0, this.w, this.h);
    this.hearts = [];
  },

  spawn(anywhereY = false) {
    const size = rand(9, 24);
    return {
      x: rand(0, this.w),
      y: anywhereY ? rand(-this.h, 0) : -size * 2,
      s: size,
      vy: rand(1.2, 3.4) * (size / 14),
      sway: rand(0.4, 1.6),
      phase: rand(0, Math.PI * 2),
      spin: rand(-0.02, 0.02),
      rot: rand(-0.5, 0.5),
      alpha: rand(0.45, 0.95),
      color: PINKS[(Math.random() * PINKS.length) | 0],
    };
  },

  heartPath(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.32);
    ctx.bezierCurveTo(
      x + s * 0.56,
      y - s * 0.18,
      x + s * 0.36,
      y - s * 0.58,
      x,
      y - s * 0.2,
    );
    ctx.bezierCurveTo(
      x - s * 0.36,
      y - s * 0.58,
      x - s * 0.56,
      y - s * 0.18,
      x,
      y + s * 0.32,
    );
    ctx.closePath();
  },

  loop() {
    if (!this.running) return;
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);
    for (let i = 0; i < this.hearts.length; i++) {
      const h = this.hearts[i];
      h.y += h.vy;
      h.phase += 0.02;
      h.rot += h.spin;
      const x = h.x + Math.sin(h.phase) * 18 * h.sway;
      if (h.y - h.s > this.h) this.hearts[i] = this.spawn(false);
      ctx.save();
      ctx.translate(x, h.y);
      ctx.rotate(h.rot);
      ctx.globalAlpha = h.alpha;
      ctx.fillStyle = h.color;
      this.heartPath(ctx, 0, 0, h.s);
      ctx.fill();
      ctx.restore();
    }
    this.raf = requestAnimationFrame(() => this.loop());
  },
};

/* ========================= SCENE: COUNTDOWN ========================= */

async function runCountdown() {
  const numEl = $("#countdown-number");
  rain.start();
  for (const n of ["3", "2", "1"]) {
    numEl.textContent = n;
    numEl.classList.remove("pop");
    void numEl.offsetWidth;
    numEl.classList.add("pop");
    await sleep(1050);
  }
  numEl.textContent = "❤️";
  numEl.classList.remove("pop");
  void numEl.offsetWidth;
  numEl.classList.add("pop");
  fx.burst(innerWidth / 2, innerHeight / 2, 70);
  await sleep(900);
  rain.stop();
  showScene("scene-title", buildTitle);
}

/* ========================= SCENE: TITLE ========================= */

function buildTitle() {
  const h1 = $("#birthday-title");
  const text = `Happy Birthday to ${CONFIG.name}`;
  h1.innerHTML = "";
  let i = 0;
  text.split(" ").forEach((word, wi, arr) => {
    const w = document.createElement("span");
    w.className = "word";
    [...word].forEach((ch) => {
      const s = document.createElement("span");
      s.className = "ltr";
      s.textContent = ch;
      s.style.animationDelay = `${0.15 + i * 0.045}s`;
      w.appendChild(s);
      i++;
    });
    h1.appendChild(w);
    if (wi < arr.length - 1) {
      const sp = document.createElement("span");
      sp.className = "ltr space";
      sp.textContent = " ";
      sp.style.animationDelay = `${0.15 + i * 0.045}s`;
      h1.appendChild(sp);
      i++;
    }
  });

  const wrap = $("#float-hearts");
  wrap.innerHTML = "";
  const emojis = ["💖", "💝", "💗", "💘", "🌸", "✨", "💞"];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.textContent = emojis[i % emojis.length];
    s.style.left = rand(2, 96) + "%";
    s.style.fontSize = rand(14, 30) + "px";
    s.style.animationDuration = rand(5.5, 10) + "s";
    s.style.animationDelay = rand(0, 6) + "s";
    wrap.appendChild(s);
  }
}

/* ========================= SCENE: CAKE ========================= */

let cakeBlown = false;

function initCake() {
  const cake = $("#cake-interactive");
  const blow = () => {
    if (cakeBlown) return;
    cakeBlown = true;
    $("#candles").classList.add("out");
    const smoke = $("#smoke");
    smoke.classList.add("show");
    const r = cake.getBoundingClientRect();
    fx.burst(r.left + r.width / 2, r.top + r.height * 0.3, 90);
    setTimeout(() => {
      $("#cake-hint").classList.add("hidden");
      $("#cake-done").classList.remove("hidden");
    }, 700);
  };
  cake.addEventListener("click", blow);
  cake.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      blow();
    }
  });
}

/* ========================= SCENE: LETTER (buku 3D) ========================= */

const book = {
  leaves: [],
  current: 0,
  active: null,
  dir: 1,
  startX: 0,
  startY: 0,
  width: 300,
  progress: 0,
  pending: false,
  dragging: false,

  init() {
    this.leaves = $$("#book .leaf");
    this.buildDots();
    this.reset();

    const el = $("#book");
    el.addEventListener("pointerdown", (e) => this.onDown(e));
    el.addEventListener("pointermove", (e) => this.onMove(e));
    el.addEventListener("pointerup", (e) => this.onUp(e, false));
    el.addEventListener("pointercancel", (e) => this.onUp(e, true));

    window.addEventListener("keydown", (e) => {
      if (!$("#scene-letter").classList.contains("active")) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.flip(1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        this.flip(-1);
      }
    });

    $("#btn-to-bouquet").addEventListener("click", () => {
      showScene("scene-bouquet", () => bouquet.start());
    });
  },

  reset() {
    this.current = 0;
    this.active = null;
    this.pending = false;
    this.dragging = false;
    this.leaves.forEach((leaf) => {
      leaf.classList.remove("flipped");
      leaf.style.transform = "";
      leaf.style.transition = "";
      leaf.style.zIndex = "";
    });
    this.update();
  },

  buildDots() {
    const dots = $("#book-dots");
    if (!dots) return;
    dots.innerHTML = "";
    for (let i = 0; i < this.leaves.length; i++) {
      const s = document.createElement("span");
      dots.appendChild(s);
    }
  },

  update() {
    this.leaves.forEach((leaf, i) => {
      leaf.style.zIndex = String(i < this.current ? 100 + i : 200 - i);
    });
    const dots = $$("#book-dots span");
    dots.forEach((d, i) => {
      d.classList.toggle("on", i === this.current);
      d.classList.toggle("done", i < this.current);
    });
    $("#book-hint").classList.toggle("hidden", this.current > 0);
    // Saat semua lembar sudah dibalik, buku digeser supaya back cover
    // (yang berada di sisi kiri) tampil di tengah layar.
    $("#book").classList.toggle("is-end", this.current >= this.leaves.length);
  },

  flip(dir) {
    if (this.dragging) return;
    if (dir === 1) {
      if (this.current >= this.leaves.length) return;
      this.leaves[this.current].classList.add("flipped");
      this.current++;
    } else {
      if (this.current <= 0) return;
      this.current--;
      this.leaves[this.current].classList.remove("flipped");
    }
    this.update();
  },

  onDown(e) {
    if (!e.isPrimary || this.active || this.dragging) return;
    // Jangan mulai swipe kalau yang ditekan tombol di dalam halaman buku.
    if (e.target.closest("button")) return;
    const rect = $("#book").getBoundingClientRect();
    if (rect.width) this.width = rect.width;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.progress = 0;
    this.pending = true;
    $("#book").setPointerCapture(e.pointerId);
  },

  onMove(e) {
    if ((!this.pending && !this.dragging) || !e.isPrimary) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    if (!this.dragging) {
      if (Math.abs(dx) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        this.pending = false;
        return;
      }
      const dir = dx < 0 ? 1 : -1;
      const leaf =
        dir === 1 ? this.leaves[this.current] : this.leaves[this.current - 1];
      if (!leaf) {
        this.pending = false;
        return;
      }
      this.dragging = true;
      this.dir = dir;
      this.active = leaf;
      if (dir === -1) {
        // Mulai membalik ke belakang: kembalikan buku ke posisi semula dulu
        // supaya halaman yang sedang ditarik terlihat normal.
        $("#book").classList.remove("is-end");
      }
      leaf.style.transition = "none";
      leaf.style.zIndex = "300";
    }

    let p;
    if (this.dir === 1) p = clamp((this.startX - e.clientX) / this.width, 0, 1);
    else p = clamp((e.clientX - this.startX) / this.width, 0, 1);
    this.progress = p;

    const deg = this.dir === 1 ? -180 * p : -180 + 180 * p;
    this.active.style.transform = `rotateY(${deg}deg)`;
  },

  onUp(e, cancelled) {
    if (!this.pending && !this.dragging) return;
    const wasDragging = this.dragging;
    const leaf = this.active;
    this.pending = false;
    this.dragging = false;
    this.active = null;
    if (!wasDragging || !leaf) return;

    const commit = !cancelled && this.progress > 0.32;
    leaf.style.transition = "";
    leaf.style.transform = "";

    if (commit) {
      this.flip(this.dir);
    } else {
      this.update();
    }
  },
};

/* ========================= SCENE: BOUQUET (hadiah bunga) ========================= */

const bouquet = {
  stage: null,
  petals: null,

  init() {
    this.stage = $("#bouquet-stage");
    this.petals = $("#bouquet-petals");
    const btn = $("#btn-to-gallery");
    if (btn) {
      btn.addEventListener("click", () => {
        showScene("scene-gallery", startGallery);
      });
    }
  },

  buildPetals() {
    if (!this.petals) return;
    this.petals.innerHTML = "";
    const many = innerWidth >= 600;
    const n = many ? 14 : 9;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      const size = rand(8, 14);
      p.style.left = rand(0, 98) + "%";
      p.style.width = size + "px";
      p.style.height = size * 1.35 + "px";
      p.style.opacity = rand(0.5, 0.9);
      p.style.setProperty("--drift", rand(-60, 60) + "px");
      p.style.animationDuration = rand(6, 12) + "s";
      p.style.animationDelay = -rand(0, 10) + "s";
      this.petals.appendChild(p);
    }
  },

  start() {
    this.buildPetals();
    if (this.stage) {
      this.stage.classList.remove("is-in");
      void this.stage.offsetWidth;
      this.stage.classList.add("is-in");
    }
    const r = (this.stage || $("#scene-bouquet")).getBoundingClientRect();
    fx.burst(r.left + r.width / 2, r.top + r.height * 0.38, 70);
  },

  reset() {
    if (this.stage) this.stage.classList.remove("is-in");
    if (this.petals) this.petals.innerHTML = "";
  },
};

/* ========================= SCENE: GALLERY (heart filled) ========================= */

function heartPoint(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  return { x, y };
}

let galleryBuilt = false;

/* Kurva heart dinormalisasi ke kotak 32 x 29 unit supaya proporsinya stabil. */
let heartUnitCache = null;
function heartUnit() {
  if (heartUnitCache) return heartUnitCache;
  const samples = 600;
  const raw = [];
  for (let i = 0; i < samples; i++) {
    const t = (Math.PI * 2 * i) / samples - Math.PI / 2;
    const p = heartPoint(t);
    raw.push([p.x, p.y]);
  }
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of raw) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const kx = 32 / (maxX - minX);
  const ky = 29 / (maxY - minY);
  heartUnitCache = raw.map(([x, y]) => [(x - minX) * kx, (maxY - y) * ky]);
  return heartUnitCache;
}

const GALLERY_GAP_X = 6;
const GALLERY_GAP_Y = 7;
const GALLERY_MARGIN = 6;
// Tinggi kartu polaroid = lebar + padding (5 + 13) + border (2).
const GALLERY_CARD_EXTRA = 8;

function heartIntervalsAt(y) {
  const unit = heartUnit();
  const xs = [];
  for (let i = 0; i < unit.length; i++) {
    const a = unit[i];
    const b = unit[(i + 1) % unit.length];
    if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) {
      const t = (y - a[1]) / (b[1] - a[1]);
      xs.push(a[0] + (b[0] - a[0]) * t);
    }
  }
  xs.sort((p, q) => p - q);
  const out = [];
  for (let i = 0; i + 1 < xs.length; i += 2) {
    out.push([xs[i], xs[i + 1]]);
  }
  return out;
}

/*
 * Susun foto mengisi area hati (scanline).
 * - Hati memakai satu skala untuk lebar & tinggi, jadi proporsinya tidak melar.
 * - Tiap baris disisipi setengah lebar foto, jadi kartu tetap di dalam kurva.
 * - Jarak baris memakai tinggi kartu sebenarnya, bukan lebar foto, supaya
 *   foto bisa besar tanpa bertumpuk.
 */
function gallerySpots(W, H, count, photoW) {
  const cardH = photoW + GALLERY_CARD_EXTRA;
  const halfW = photoW / 2;
  const availW = Math.max(120, W - GALLERY_MARGIN * 2);
  const availH = Math.max(120, H - GALLERY_MARGIN * 2);

  const s = Math.min(availW / 32, availH / 29);
  const heartW = 32 * s;
  const heartH = 29 * s;
  const originX = (W - heartW) / 2;
  const originY = (H - heartH) / 2;
  const empty = { spots: [], photoW, heartW, heartH, originX, originY };

  const yStart = (cardH / 2 + 2) / s;
  const yEnd = 29 - (cardH / 2 + 2) / s;
  if (yEnd <= yStart) return empty;

  const rowStep = (cardH + GALLERY_GAP_Y) / s;
  const rowCount = Math.max(2, Math.floor((yEnd - yStart) / rowStep) + 1);
  const used = (rowCount - 1) * rowStep;
  const firstY = yStart + (yEnd - yStart - used) / 2;

  const groups = [];
  let rowsUsed = 0;
  for (let i = 0; i < rowCount; i++) {
    const y = firstY + i * rowStep;
    const rowGroups = [];
    heartIntervalsAt(y).forEach(([a, b]) => {
      const lo = a * s + halfW + 1;
      const hi = b * s - halfW - 1;
      if (hi < lo) return;
      const cap =
        Math.floor((hi - lo + GALLERY_GAP_X) / (photoW + GALLERY_GAP_X)) + 1;
      if (cap < 1) return;
      rowGroups.push({ y, lo, hi, cap, widthUnit: b - a });
    });
    if (rowGroups.length) {
      rowsUsed++;
      groups.push(...rowGroups);
    }
  }
  if (!groups.length) return empty;

  const totalWUnit = groups.reduce((sum, g) => sum + g.widthUnit, 0) || 1;
  const counts = groups.map((g) => {
    if (g.cap <= 0) return 0;
    return Math.max(
      1,
      Math.min(Math.round((count * g.widthUnit) / totalWUnit), g.cap),
    );
  });

  let sum = counts.reduce((a, b) => a + b, 0);
  let guard = 0;
  while (sum < count && guard++ < 600) {
    let best = -1;
    let bestScore = -1;
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].cap <= counts[i]) continue;
      const score = groups[i].widthUnit / (counts[i] + 1);
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
    if (best < 0) break;
    counts[best]++;
    sum++;
  }
  guard = 0;
  while (sum > count && guard++ < 1000) {
    let best = -1;
    let bestScore = Infinity;
    for (let i = 0; i < groups.length; i++) {
      if (counts[i] <= 1) continue;
      const score = groups[i].widthUnit / counts[i];
      if (score < bestScore) {
        bestScore = score;
        best = i;
      }
    }
    if (best < 0) break;
    counts[best]--;
    sum--;
  }

  const spots = [];
  groups.forEach((g, gi) => {
    const n = counts[gi];
    if (!n) return;
    for (let k = 0; k < n; k++) {
      // Satu foto di tengah baris; lebih dari satu disebar rata sampai tepi.
      const x =
        n === 1 ? (g.lo + g.hi) / 2 : g.lo + ((g.hi - g.lo) * k) / (n - 1);
      spots.push({ x: originX + x, y: originY + g.y * s });
    }
  });

  return {
    spots,
    photoW,
    heartW,
    heartH,
    originX,
    originY,
    rowsPlanned: rowCount,
    rowsUsed,
  };
}

/*
 * Cari ukuran foto terbesar yang:
 * 1) memuat semua foto, dan
 * 2) semua baris yang direncanakan benar-benar terpakai.
 *
 * Syarat kedua penting: kalau foto terlalu besar, baris paling bawah jadi
 * kosong dan ujung hati ikut hilang. Karena kelayakan ukuran tidak selalu
 * naik-turun mulus, kita cari dari ukuran terbesar ke bawah.
 */
function fitGallery(W, H, count) {
  const maxW = Math.max(16, Math.min(W, H) * 0.45);
  // Pilih foto sebesar mungkin selama seluruh susunan tetap muat di kurva.
  for (let w = maxW; w >= 16; w -= 0.5) {
    const layout = gallerySpots(W, H, count, w);
    if (
      layout.spots.length >= count &&
      layout.rowsUsed === layout.rowsPlanned
    ) {
      return layout;
    }
  }
  return gallerySpots(W, H, count, 24);
}

const HEART_PATTERN = [
  " XX XX ",
  "XXXXXXX",
  "XXXXXXX",
  " XXXXX ",
  "  XXX  ",
  "   X   ",
];

function heartGridPositions(count) {
  const cells = [];
  HEART_PATTERN.forEach((row, rowIndex) => {
    [...row].forEach((cell, colIndex) => {
      if (cell === "X") cells.push({ row: rowIndex + 1, col: colIndex + 1 });
    });
  });

  if (count >= cells.length) return cells;
  return Array.from({ length: count }, (_, i) => {
    const index = Math.round((i * (cells.length - 1)) / Math.max(1, count - 1));
    return cells[index];
  });
}

function startGallery(animate = true) {
  const field = $("#heart-formation");
  field.innerHTML = "";
  $("#gallery-final").classList.remove("is-visible");
  $("#gallery-hint").textContent = "i love u with my whole heart ❤️";

  const W = window.innerWidth;
  const H = field.clientHeight;
  if (!field.clientWidth || !H) {
    requestAnimationFrame(() => startGallery());
    return;
  }

  const photos = CONFIG.photos;
  const count = photos.length;
  const animateIn = animate !== false;
  const positions = heartGridPositions(count);
  const cards = positions.map((position, idx) => {
    const card = document.createElement("div");
    card.className = "polaroid";
    card.style.transition = "none";
    card.style.opacity = "0";
    card.style.gridColumn = String(position.col);
    card.style.gridRow = String(position.row);
    card.style.zIndex = String(40 + position.row);

    // Gunakan rotasi kecil agar siluet grid hati tetap mudah terbaca.
    const rot = rand(-0.7, 0.7);
    card.style.transform = `rotate(${rot}deg)`;

    const img = document.createElement("img");
    img.alt = `Momen ${idx + 1}`;
    img.decoding = "async";
    withFallback(img, `${idx + 1}`);
    img.src = photos[idx % photos.length];
    card.appendChild(img);
    card.addEventListener("click", () => openLightbox(idx, photos));
    field.appendChild(card);
    return { card, rot };
  });

  // Animasi masuk: dari posisi acak + zoom kecil ke posisi akhir.
  if (animateIn) {
    cards.forEach(({ card, rot }, idx) => {
      const startDx = rand(-W * 0.2, W * 0.2);
      const startDy = rand(-H * 0.16, H * 0.16);
      const startRot = rot + rand(-15, 15);
      const startScale = rand(0.7, 0.9);
      card.style.transitionDelay = `${0.1 + idx * 0.08}s`;
      card.style.opacity = "0";
      card.style.transform = `translate(${startDx}px, ${startDy}px) rotate(${startRot}deg) scale(${startScale})`;
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cards.forEach(({ card, rot }) => {
          card.style.transition = "";
          card.style.opacity = "1";
          card.style.transform = `translate(0, 0) rotate(${rot}deg) scale(1)`;
        });
      });
    });
  } else {
    cards.forEach(({ card, rot }) => {
      card.style.transition = "";
      card.style.opacity = "1";
      card.style.transform = `rotate(${rot}deg)`;
    });
  }

  const totalMs = 1400 + count * 90 + 800;
  galleryBuilt = true;

  setTimeout(() => {
    if (!$("#scene-gallery").classList.contains("active")) return;
    $("#gallery-hint").textContent = "our memories and some cutiepatootie❤️";
    const r = field.getBoundingClientRect();
    fx.burst(r.left + r.width / 2, r.top + r.height / 2, 80);
    $("#gallery-final").classList.add("is-visible");
    if (typeof loveRain !== "undefined") loveRain.start();
  }, totalMs);
}

/* ========================= LIGHTBOX (pratinjau foto) ========================= */

const lightbox = {
  photos: [],
  index: 0,
  el: null,
  img: null,
  cap: null,
  touchX: 0,

  init() {
    this.el = $("#lightbox");
    this.img = $("#lightbox-img");
    this.cap = $("#lightbox-count");
    if (!this.el) return;

    $("#lightbox-close").addEventListener("click", () => this.close());
    $("#lightbox-prev").addEventListener("click", () => this.go(-1));
    $("#lightbox-next").addEventListener("click", () => this.go(1));
    this.el.addEventListener("click", (e) => {
      if (e.target === this.el) this.close();
    });

    document.addEventListener("keydown", (e) => {
      if (this.el.hidden) return;
      if (e.key === "Escape") this.close();
      if (e.key === "ArrowLeft") this.go(-1);
      if (e.key === "ArrowRight") this.go(1);
    });

    this.el.addEventListener(
      "touchstart",
      (e) => {
        this.touchX = e.changedTouches[0].clientX;
      },
      { passive: true },
    );
    this.el.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - this.touchX;
        if (Math.abs(dx) > 45) this.go(dx < 0 ? 1 : -1);
      },
      { passive: true },
    );
  },

  open(index, photos) {
    this.photos = photos || [];
    if (!this.photos.length) return;
    this.index = index;
    this.el.hidden = false;
    this.render();
  },

  close() {
    if (!this.el) return;
    this.el.hidden = true;
    this.img.removeAttribute("src");
  },

  go(step) {
    if (!this.photos.length) return;
    this.index = (this.index + step + this.photos.length) % this.photos.length;
    this.render();
  },

  render() {
    this.img.src = this.photos[this.index];
    this.cap.textContent = `${this.index + 1} / ${this.photos.length}`;
  },
};

function initLightbox() {
  lightbox.init();
}

function openLightbox(index, photos) {
  lightbox.open(index, photos);
}

/* ========================= SHARE + TOAST ========================= */

let toastTimer = null;

function showToast(text) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

function initShare() {
  const btn = $("#btn-share");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const url = location.href;
    const payload = {
      title: "Happy Birthday, Firna",
      text: "Ada sesuatu untukmu… surprise ultah buat kamu 💗",
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link-nya sudah tersalin 💌");
    } catch (err) {
      showToast(url);
    }
  });
}

/* ========================= REPLAY ========================= */

function resetAll() {
  cakeBlown = false;
  $("#candles").classList.remove("out");
  $("#smoke").classList.remove("show");
  $("#cake-hint").classList.remove("hidden");
  $("#cake-done").classList.add("hidden");
  book.reset();
  bouquet.reset();
  $("#gallery-final").classList.remove("is-visible");
  $("#heart-formation").innerHTML = "";
  galleryBuilt = false;
  fx.stop();
  if (typeof loveRain !== "undefined") loveRain.stop();
  const env = $("#intro-envelope");
  if (env) env.classList.remove("opening");
  experienceStarted = false;
}

/* ========================= BOOT ========================= */

/* Foto surat sengaja TIDAK dimuat saat halaman dibuka.
   Kalau dimuat sekaligus, 10 foto (~620 KB) ikut terunduh sebelum
   scene surat даже sampai dilihat. Foto baru diambil saat scene kuen
   (prefetch) lalu dipastikan lengkap saat scene surat dibuka.       */
let letterPhotosLoaded = false;
let experienceStarted = false;

function loadLetterPhotos() {
  if (letterPhotosLoaded) return;
  letterPhotosLoaded = true;
  $$("#book img[data-photo]").forEach((img) => {
    const src = CONFIG.letterPhotos[+img.dataset.photo];
    withFallback(img, CONFIG.name);
    if (src) img.src = src;
  });
}

function boot() {
  fx.init();
  rain.init();
  if (typeof loveRain !== "undefined") loveRain.init();

  const startExperience = () => {
    if (experienceStarted) return;
    experienceStarted = true;
    const env = $("#intro-envelope");
    if (env) {
      env.classList.add("opening");
      setTimeout(() => showScene("scene-countdown", runCountdown), 430);
    } else {
      showScene("scene-countdown", runCountdown);
    }
  };

  $("#btn-start").addEventListener("click", startExperience);
  const env = $("#intro-envelope");
  if (env) env.addEventListener("click", startExperience);

  $("#btn-to-cake").addEventListener("click", () => {
    showScene("scene-cake", () => loadLetterPhotos());
  });

  $("#btn-to-letter").addEventListener("click", () => {
    showScene("scene-letter", () => loadLetterPhotos());
  });

  $("#btn-replay").addEventListener("click", () => {
    resetAll();
    showScene("scene-countdown", runCountdown);
  });

  $("#btn-home").addEventListener("click", () => {
    resetAll();
    showScene("scene-intro");
  });

  initShare();
  initLightbox();

  // Susun ulang heart kalau ukuran layar berubah.
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (!$("#scene-gallery").classList.contains("active")) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => startGallery(false), 250);
  });

  initCake();
  book.init();
  bouquet.init();
}

document.addEventListener("DOMContentLoaded", boot);
