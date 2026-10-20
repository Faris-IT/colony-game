# Berkontribusi

Terima kasih sudah tertarik pada Mufa Colony.

## Aturan inti
- **Tanpa dependensi dan aset eksternal** di dalam game (tidak ada framework, library, gambar, audio, atau font eksternal). Semua visual digambar dengan HTML, CSS, atau SVG inline.
- **Bangunan adalah data.** Tambah atau ubah bangunan di `data/buildings.js`, bukan di logika yang tersebar.
- **Mesin dan tampilan terpisah.** Perhitungan simulasi tidak boleh ada di `renderer.js`.
- Satu mode = satu file di `modes/`. Mode baru harus mengubah minimal tiga unsur dari Classic (tujuan, sumber daya awal, ukuran peta, bangunan, batas waktu, aturan ekonomi, kejadian, kondisi menang atau kalah).

## Alur kerja
1. Fork, buat cabang, lakukan perubahan.
2. Jalankan `node tests/run.js`. Semua pengujian harus lulus.
3. Jika mengubah angka keseimbangan, perbarui [docs/BALANCE.md](docs/BALANCE.md).
4. Jika mengubah `data/buildings.js`, jalankan `npm run docs`.
5. Buka Pull Request dengan template yang tersedia.

Panduan menambah mode ada di [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).
