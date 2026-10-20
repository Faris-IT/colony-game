# Panduan pengembangan

## Prinsip
- **Simulation engine** menjalankan satu hari dan bisa diuji berulang karena berbasis giliran.
- **Bangunan adalah data** di `data/buildings.js`. Tidak ada logika bangunan yang tersebar.
- **Mode** hanya menentukan kondisi awal, tujuan, serta kondisi menang dan kalah.
- **Renderer** hanya menggambar. **Storage** menangani simpan dan pulih data dengan aman.
- Tidak ada framework, library, backend, atau aset eksternal. Skrip dimuat berurutan lewat `<script>` (bukan ES module) agar game tetap berjalan saat `index.html` dibuka langsung dari file.

## Modul
| File | Tanggung jawab |
|---|---|
| `js/config.js` | Konstanta: sumber daya, pajak, prioritas pekerja, hadiah membersihkan petak, versi |
| `js/state.js` | Membuat dan memperbaiki state permainan (`State.init`, `State.fix`) |
| `js/map.js` | Peta: pembangkit acak, lahan subur, kabut, perluasan |
| `js/buildings.js` | Bangun, hapus, perbaiki, ekspedisi, biaya terskala |
| `js/economy.js` | Produksi, bahan, cadangan alam, penjualan stok, pemeliharaan, gudang |
| `js/population.js` | Makan, kapasitas, pertumbuhan, kepuasan, pengangguran |
| `js/events.js` | Bencana, gangguan energi, kekeringan, ekspansi Endless |
| `js/simulation.js` | `Sim.runDay`: urutan satu hari, riwayat statistik |
| `js/scoring.js` | Skor akhir dengan bobot per mode |
| `js/renderer.js` | Menggambar peta, jalan yang menyambung, petunjuk tutorial |
| `js/sprites.js` | Semua grafis SVG buatan sendiri |
| `js/ui.js`, `js/dialogs.js`, `js/screens.js` | Panel, modal, statistik, menu, layar hasil |
| `js/store.js`, `js/achievements.js` | Penyimpanan lokal dan 12 pencapaian |
| `modes/*.js` | Satu file per mode |
| `data/*.js` | Katalog bangunan dan misi Campaign |

## Urutan satu hari (`Sim.runDay`)
1. Kejadian (`Events.run`): kekeringan, gangguan, bencana, ekspansi.
2. Susun daftar bangunan, tentukan terhubung jalan, lalu bagi pekerja menurut prioritas.
3. Produksi dan konsumsi bahan (pembangkit lebih dulu), termasuk cadangan alam dan bonus jalan.
4. Penjualan stok (jika mode mengaktifkan), pajak, dan pemeliharaan.
5. Skor lingkungan, makan, pertumbuhan, kepuasan, dan batas kapasitas.
6. Streak, riwayat harian, lalu hari bertambah.

## Menambah bangunan
Tambahkan satu entri di `data/buildings.js` dengan properti `cost`, `maintenance`, `workersRequired`, `production`, `consumption`, `capacity`, dan `effects`. Tambahkan gambar SVG di `js/sprites.js` dengan kunci id yang sama. Jalankan `npm run docs` untuk memperbarui katalog.

## Menambah mode
1. Buat `modes/nama-mode.js`. Daftarkan konfigurasi di `CONFIG.modes.<id>` (ukuran peta, sumber daya awal, `rules`, `preset`, `fog`, `natural`) dan objek `Modes.<id>` dengan `name`, `desc`, `diff`, `introHtml(S)`, `goals(S)`, `evaluate(S)`, dan opsional `hint(S)` serta `score(S)`.
2. `evaluate` mengembalikan `null`, `{result:'win'|'lose'|'end', reason}`.
3. Tambahkan `<script>` di `index.html` dan id di `Screens.ids` (`js/screens.js`).
4. Tambahkan bot di `tests/balance.test.js`. Mode baru harus berbeda minimal 3 unsur dari Classic.

Aturan khusus mode ada di `rules`: `sell`, `maintMult`, `taxMult`, `growth`, `unemployment`, `roadRequired`, `green`, `showEnv`, `fertileOnly`, `fog`, `repair`, `disasters`, `blackout`, `demandGrowth`, `endless`.

## Pengujian
```bash
node tests/run.js        # semua
node tests/run.js -v     # tampilkan setiap baris
```
`tests/harness.js` memuat game dari urutan `<script>` di `index.html`, sehingga file baru di `index.html` otomatis ikut diuji.

## Gambar repository
```bash
npm run assets   # banner, pratinjau, social preview, favicon (dari grafis dan state game)
npm run docs     # docs/BUILDINGS.md
```
