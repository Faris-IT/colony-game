# Cara bermain

## Konsep dasar
Kamu mengelola koloni di peta kotak-kotak. Permainan berbasis **giliran harian**: kamu membangun sesukamu, lalu menekan **Hari berikutnya**. Satu hari memproses produksi, makan, biaya operasional, dan kejadian.

Siklus: **Rencanakan** (periksa sumber daya dan kebutuhan) → **Bangun dan atur** → **Jalankan satu hari** → **Evaluasi** (baca laporan, atasi masalah).

## Layar
| Bagian | Fungsi |
|---|---|
| **Kiri atas: Tujuan** | Syarat menang mode ini beserta progresnya |
| **Kiri tengah: Info bangunan** | Biaya, pemeliharaan, pekerja, hasil, dan kebutuhan bangunan yang dipilih, serta petak yang ditunjuk kursor |
| **Kiri bawah: Laporan harian** | Ringkasan hari terakhir. Tombol **Detail** membuka laporan lengkap |
| **Tengah: Peta** | Klik atau sentuh petak untuk membangun |
| **Kanan: Bangunan** | Pilih bangunan atau alat (Hapus, Perbaiki, Ekspedisi) |
| **Atas: chip sumber daya** | Klik untuk statistik produksi dan konsumsi harian |

## Sumber daya
- **Makanan:** tiap warga makan 1 per hari. Jika habis, kepuasan turun, dan kelaparan 2 hari berturut-turut membuat warga pergi.
- **Kayu dan batu:** bahan bangunan. Membersihkan pohon memberi 5 kayu, batu memberi 4 batu.
- **Coins:** dari pajak warga (1 per warga, naik jika puas), penjualan stok, dan bangunan tertentu. Dipakai untuk membangun dan membayar pemeliharaan harian.
- **Energi:** dihasilkan pembangkit, dipakai Apartemen, Bengkel, Klinik, Sekolah, dan Pasar. Baterai menyimpan kelebihan.
- **Penduduk:** chip menampilkan `penduduk/yang bekerja`, misalnya `12 /8 kerja`.

## Warga: tempat tinggal, pekerjaan, kepuasan
- **Rumah** menampung 4 warga, **Apartemen** 12 (6 jika tanpa energi). Koloni punya kapasitas dasar 5. Penduduk tidak pernah melebihi kapasitas.
- Bangunan produksi butuh **pekerja**. Warga mengisi lowongan menurut prioritas, jadi bangunan yang kekurangan pekerja menjadi abu-abu.
- **Kepuasan** dasar 80%. Tiap 10 warga butuh 1 fasilitas sosial (Taman, Klinik, Sekolah, atau Pasar). Kepuasan memengaruhi pajak dan kecepatan pertumbuhan: di bawah 50% warga tidak bertambah, di atas 85% tumbuh lebih cepat, di bawah 30% warga pergi.

## Jalan
Jalan menyambung otomatis (lurus, tikungan, pertigaan, perempatan). Bangunan yang menempel jalan menghasilkan **+20%**. Di **Tiny Territory**, bangunan hanya beroperasi jika menempel jalan.

## Tanda pada bangunan
| Tanda | Arti |
|---|---|
| Abu-abu dengan titik merah | Tidak beroperasi. Arahkan kursor untuk alasan (kurang pekerja, bahan, energi, atau jalan) |
| Garis merah miring | Rusak (mode bencana). Pakai alat **Perbaiki** |
| Bingkai emas | Lokasi sumber daya khusus (produksi x2) |
| Bunga kuning | Lahan subur (ladang x1,5) |

## Tips awal
1. Mulai dengan 1-2 ladang dan 1-2 rumah. Ladang butuh 2 pekerja.
2. Jangan bangun lebih banyak bangunan berpekerja daripada warga yang tersedia.
3. Bangun Penggergajian dan Tambang Batu lebih awal (hanya butuh Coins).
4. Jangan menghabiskan semua Coins. Pemeliharaan harian tetap dibayar.
5. Tambah fasilitas sosial sebelum penduduk melewati kelipatan 10.
6. Pembangkit baru berguna jika ada bangunan yang memakai energi.

## Tips per mode
Lihat [MODES.md](MODES.md).

## Penyimpanan
Permainan tersimpan otomatis setiap hari di browser. Pilih **Menu → Lanjutkan permainan** untuk melanjutkan. Menghapus data browser menghapus progres. Tidak ada sinkronisasi antar-perangkat.
