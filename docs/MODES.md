# Mode permainan

Semua mode memakai mesin simulasi yang sama. Tiap mode mengubah minimal tiga unsur (tujuan, sumber daya awal, ukuran peta, bangunan, batas waktu, aturan ekonomi, kejadian, kondisi menang atau kalah). Tabel ini mengikuti kode di `modes/` dan `data/campaign-levels.js`.

## Tutorial
12 langkah: rumah, ladang, membersihkan petak, penggergajian, jalan, hari berikutnya, 3 hari lagi, rumah kedua, pembangkit, pasar, taman, 10 penduduk. Panah menunjuk tombol dan petak yang perlu diklik. Hanya kalah jika penduduk habis.

## 1. Colony Classic
Mulai dari 5 penduduk. **Menang:** 30 penduduk, kas positif, makanan aman 5 hari berturut-turut. **Kalah:** penduduk habis atau kas minus 5 hari berturut-turut.

## 2. Speed Builder
Peta 16x12, modal besar, **30 hari**. Skor = penduduk x10 + bangunan aktif x5 + produksi harian x2 + kepuasan x2. **Menang:** skor 700 sebelum waktu habis. Waktu habis hanya menampilkan skor akhir tanpa penalti.

## 3. Survival Colony
Stok awal tipis (makanan 30, kayu 50, batu 10, Coins 150), pemeliharaan 1,5x, pajak 0,7x. **Kayu alam 160 dan batu alam 60** adalah cadangan: Penggergajian dan Tambang berhenti saat habis. **Menang:** bertahan 60 hari. **Kalah:** penduduk habis atau kelaparan 5 hari.

## 4. Economic Empire
Peta 20x14. **Surplus makanan, kayu, dan batu dijual otomatis** tiap hari (harga: 2, 3, 4 Coins). Menjual banyak sekaligus menurunkan harga sampai 50%. Cadangan yang tidak dijual: makanan 4 hari warga + 10, kayu dan batu 40. **Menang:** 10.000 Coins dan laba bersih positif 10 hari berturut-turut. **Kalah:** utang lebih dari 300 Coins.

## 5. Green Colony
Skor lingkungan dasar 45, naik oleh taman, kebun, dan pohon, turun oleh industri. Lingkungan di bawah 60 menurunkan kepuasan. Pajak 0,85x. **Menang:** kepuasan 80% dan lingkungan 85 selama 7 hari berturut-turut. **Kalah:** penduduk habis atau bangkrut 5 hari.

## 6. Disaster Response
Mulai dengan bangunan rusak dan stok rendah. Badai atau kebakaran merusak 2 bangunan di **hari 4, 8, dan 12**. Alat **Perbaiki** berbiaya 50% harga bangun. Pajak 1,3x. Bangunan vital: Rumah, Ladang, Klinik, Pembangkit. **Menang:** semua vital pulih dan bertahan 20 hari. **Kalah:** vital masih rusak di hari ke-30, atau penduduk habis.

## 7. Population Boom
Warga bertambah 3 per hari (4 jika kepuasan 85%+) selama rumah muat. **Pengangguran menurunkan kepuasan.** **Menang:** 100 penduduk dengan kepuasan 75%. **Kalah:** penduduk habis atau kelaparan 5 hari.

## 8. Tiny Territory
Peta 8x6 (48 petak). **Bangunan hanya beroperasi jika menempel jalan**, padahal jalan memakai petak. **Menang:** 20 penduduk, 80 makanan, dan 500 Coins sekaligus. **Kalah:** penduduk habis atau bangkrut 5 hari.

## 9. Frontier Explorer
Peta 18x12 tertutup kabut kecuali area tengah. Alat **Ekspedisi** membuka area 3x3 dengan biaya 8 makanan dan 20 Coins ditambah 5 per ekspedisi sebelumnya. Bisa ditemukan pohon, batu, lahan subur, rawa (tak bisa dibangun), dan 3 lokasi sumber daya khusus (produksi x2). **Menang:** temukan dan bangun di ketiga lokasi. **Kalah:** penduduk habis atau bangkrut 5 hari.

## 10. Energy Crisis
Mulai dengan apartemen, klinik, sekolah, pasar, bengkel, dan satu pembangkit. Setiap **5 hari** muncul apartemen baru dan setiap **7 hari** output pembangkit separuh. Saat energi kurang, bangunan prioritas rendah (Bengkel, Pasar) berhenti lebih dulu. **Menang:** 15 hari berturut-turut tanpa kekurangan energi dengan semua apartemen, klinik, dan sekolah aktif.

## 11. Endless Settlement
Tanpa akhir tetap. Setiap **10 hari** peta bertambah 2x2 (sampai lebar 24), biaya bangunan naik 8% (maksimal 300%, bahan maksimal 150 per bangunan), dan 50% kemungkinan musim kering 3 hari. **Ladang di luar lahan subur hanya menghasilkan 60%.** **Kalah:** penduduk habis, bangkrut 7 hari, atau kelaparan 6 hari. Kejar skor dan hari bertahan.

## 12. Colony Campaign
Enam misi berurutan, tiap misi terbuka setelah misi sebelumnya selesai.

| Misi | Mekanik | Target | Batas |
|---|---|---|---|
| 1. Fondasi | Rumah, ladang, pekerja | 12 penduduk, makanan aman 3 hari | 30 hari |
| 2. Roda Ekonomi | Penjualan stok | 1.800 Coins | 35 hari |
| 3. Tenaga Listrik | Energi, prioritas, gangguan | Energi stabil 8 hari | 35 hari |
| 4. Hijau Kembali | Lingkungan | Hijau 3 hari berturut-turut | 45 hari |
| 5. Terra Incognita | Eksplorasi | Temukan dan bangun di 2 lokasi | 45 hari |
| 6. Pasca Badai | Bencana dan perbaikan | Vital pulih, bertahan 15 hari | 25 hari |

## Pencapaian
First Settlement, Growing Community (20 penduduk), Food Security (stok 10 hari), Profitable Colony (laba positif 10 hari), Green Future, Survivor (30 hari), Efficient Planner (Tiny Territory), Explorer (buka 20 petak), Energy Stable (15 hari), Master Builder (10 jenis bangunan), Campaign Finisher, dan Colony Legend (skor keseluruhan 5.000).
