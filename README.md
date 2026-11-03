# 🎂 Happy Birthday, Firna

Surat ultah digital interaktif. Website statis (HTML + CSS + JS murni, tanpa
build step dan tanpa dependency), jadi bisa langsung di-hosting di mana saja.

## Isi website

| Scene | Isi |
|---|---|
| Intro | Amplop yang bisa diklik, tombol **Buka Kejutan** |
| Countdown | Hujan hati + angka 3 → 2 → 1 |
| Judul | Tulisan "Happy Birthday to Firna" dengan animasi per huruf |
| Kue | Kuen SVG, tiup lilin, efek confetti |
| Surat | Buku 3D 9 halaman (geser kiri/kanan, atau pakai panah keyboard) |
| Galeri | 24 foto memenuhi bentuk hati + panel penutup |

Bonus: musik background dari file MP3, lightbox pratinjau
foto, tombol bagikan, dan preview rapi saat link dibuka di WhatsApp/Instagram.

## Cara preview lokal

**Cara termudah:** klik dua kali `index.html` (butuh JavaScript aktif).
Seluruh aset memakai path relatif, jadi langsung jalan dari disk.

**Cara dengan server** (punya URL `http://localhost:8080`):

```bash
python -m http.server 8080
```

Atau di VS Code: tekan **F5** — file `.vscode/tasks.json` otomatis menyalakan
server lalu membuka Chrome ke `http://localhost:8080`.

## Cara publish ke GitHub Pages

1. Upload semua file repository ini ke GitHub (repo boleh `username/firna-birthday`).
2. **Settings → Pages → Source: Deploy from a branch** → pilih branch `main`, folder `/ (root)` → Save.
3. Tunggu 1-2 menit. Situsnya tayang di:
   `https://username.github.io/firna-birthday/`

> Semua path di kode memakai path relatif (`css/`, `js/`, `assets/`), jadi tidak
> ada yang perlu diubah untuk subpath GitHub Pages.

## Kalau mau link-nya muncul rapi di WhatsApp / Instagram

`og:image` dan `twitter:image` di `index.html` masih berupa path relatif.
Sebagian besar platform sudah bisa me-resolve path relatif sendiri, tapi kalau
mau 100% aman, ganti dengan URL absolut setelah situsnya tayang:

```html
<meta property="og:image" content="https://username.github.io/firna-birthday/assets/og-cover.png">
```

## Update URL pada halaman QR

Buka `qr.html`, isi kolom **URL Website** dengan alamat situs yang sudah jadi,
lalu klik **Download PNG**. Link permanennya ada di `js`/inline script pada
file yang sama:

```js
const DEFAULT_URL = "https://USERNAME.github.io/firna-birthday/";
```

Ganti `USERNAME` dengan username GitHub kamu.

## Mengganti foto & teks

Semua foto dan teks ada di satu tempat, yaitu bagian `CONFIG` di
`js/main.js`.
```js
const CONFIG = {
  name: "Firna",

  // Foto di dalam surat (10 foto, urutan sesuai halaman)
  letterPhotos: [
    "assets/myfavperson.jpeg",
    "assets/firna1.jpeg",
    // ...
  ],

  // Foto galeri heart (bebas jumlah, minimal ~6 biar heart-nya tetap rapi)
  photos: [
    "assets/1.jpeg",
    "assets/2.jpeg",
    // ...
    "assets/12.jpeg",
    "assets/us1.jpeg",
    // ... assets/us12.jpeg
  ]
};
```

Taruh fotonya di folder `assets/`, lalu sesuaikan daftar di atas. Format
`jpeg`/`jpg`/`png` semuanya bisa.

Teks surat, judul, dan kalimat penutup ada langsung di `index.html` — cari
`class="bp-text"`, `class="bp-cap"`, atau `class="bp-sign"`.

## Struktur folder

```
.
├── index.html              # website utama
├── qr.html                 # pembuat QR code (halaman terpisah)
├── assets/                 # foto + og-cover.png + apple-touch-icon.png
├── css/style.css
├── js/
│   ├── main.js             # scene, surat, galeri
│   ├── music.js            # pemutar musik background dari file MP3
│   └── qrcode.min.js       # library QR (versi minified)
└── .vscode/                # konfigurasi lokal (tidak ikut ke GitHub)
```

## Catatan teknis

- Foto surat sengaja dimuat **saat scene surat dibuka**, bukan saat halaman
  dibuka — supaya halaman pertama cuma ~50 KB dan cepat dibuka di HP.
- Musik background memakai `assets/Paul Partohap - P.S. I LOVE YOU (Lyric Video).mp3`.
- Browser baru mengizinkan musik diputar setelah pengunjung berinteraksi dengan halaman.
- `prefers-reduced-motion` sudah didukung: animasi dimatikan otomatis untuk
  pengguna yang terbiasa dengan reduced motion.
- Galeri otomatis menyesuaikan ukuran foto dan jumlah baris supaya semua foto
  memenuhi bentuk hati tanpa saling menutupi, baik di layar HP maupun desktop.
