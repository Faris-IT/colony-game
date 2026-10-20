# Mengunggah ke GitHub

Ganti `faris-it` dengan nama pengguna GitHub Anda di semua tempat berikut. Cara tercepat, dari folder proyek:

```bash
# macOS / Linux
grep -rl faris-it --exclude-dir=.git . | xargs sed -i.bak 's/faris-it/faris-it/g' && find . -name '*.bak' -delete
# Windows (PowerShell)
Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\\\' } | ForEach-Object { (Get-Content $_.FullName) -replace 'faris-it','faris-it' | Set-Content $_.FullName }
```

## 1. Buat repository
1. Di GitHub: **New repository**, nama `colony-game`, **Public**, tanpa README, `.gitignore`, atau lisensi (sudah ada di proyek).
2. Di folder proyek:

```bash
git init -b main
git add .
git commit -m "Mufa Colony 1.0.0"
git remote add origin https://github.com/faris-it/colony-game.git
git push -u origin main
```

## 2. Aktifkan GitHub Pages
**Settings → Pages → Build and deployment → Source: GitHub Actions.** Workflow `Deploy ke GitHub Pages` berjalan otomatis setiap push ke `main`. Setelah selesai, game tersedia di `https://faris-it.github.io/colony-game/`.

## 3. Percantik halaman repository
- **About (ikon roda gigi di kanan atas halaman repo):**
  - Deskripsi: `Game simulasi, strategi, dan manajemen sumber daya di browser. 12 mode + Tutorial, HTML/CSS/JS murni, tanpa aset eksternal.`
  - Website: URL GitHub Pages.
  - Topics: `game`, `browser-game`, `simulation`, `strategy`, `city-builder`, `colony-sim`, `resource-management`, `javascript`, `vanilla-js`, `html5-game`, `svg`, `indonesia`
- **Social preview** (Settings → General → Social preview): GitHub hanya menerima PNG atau JPG. Ubah `assets/social-preview.svg` menjadi PNG 1280x640, misalnya buka file itu di browser lalu ambil tangkapan layar 1280x640, atau pakai `rsvg-convert -w 1280 assets/social-preview.svg -o social-preview.png` atau Inkscape.
- **Release:** `git tag v1.0.0 && git push --tags`, lalu **Releases → Draft a new release** dan salin isi `CHANGELOG.md`.
- **Pin repository** ini di profil Anda.

## 4. Pastikan CI hijau
Tab **Actions** harus menampilkan `CI` lulus. Badge di README akan menampilkannya otomatis.

## 5. Setelah ada tangkapan layar asli
`assets/preview.svg` dirender dari state game, bukan tangkapan layar browser. Setelah Anda bermain, Anda dapat menambahkan tangkapan layar asli (PNG) ke `assets/` dan menautkannya di README.
