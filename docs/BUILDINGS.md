# Katalog bangunan

> Dibuat otomatis dari `data/buildings.js` dengan `npm run docs`. Semua nilai adalah nilai awal yang diuji lewat balancing, bukan angka final yang dijamin seimbang.

| Bangunan | Kategori | Biaya | Pemeliharaan/hari | Pekerja | Produksi/hari | Konsumsi/hari | Kapasitas | Efek |
|---|---|---|---|---|---|---|---|---|
| **Jalan** | Infrastruktur | 5 Coins | 0 Coins | - | - | - | - | - |
| **Rumah** | Perumahan | 20 kayu, 30 Coins | 1 Coins | - | - | - | menampung 4 warga | - |
| **Apartemen** | Perumahan | 30 kayu, 40 batu, 120 Coins | 4 Coins | - | - | 1 energi | menampung 12 warga (tanpa energi: 6) | - |
| **Ladang** | Makanan | 10 kayu, 20 Coins | 1 Coins | 2 | 6 makanan | - | - | - |
| **Kebun Buah** | Makanan | 25 kayu, 50 Coins | 2 Coins | 2 | 9 makanan | - | - | lingkungan +1 |
| **Penggergajian** | Industri | 40 Coins | 2 Coins | 2 | 6 kayu | - | - | lingkungan -1 |
| **Tambang Batu** | Industri | 50 Coins | 2 Coins | 3 | 5 batu | - | - | lingkungan -2 |
| **Bengkel** | Industri | 30 kayu, 30 batu, 100 Coins | 4 Coins | 3 | 15 Coins | 2 kayu, 1 batu, 2 energi | - | lingkungan -2 |
| **Pembangkit** | Energi | 40 batu, 150 Coins | 5 Coins | 2 | 10 energi | - | - | lingkungan -3 |
| **Baterai** | Energi | 20 batu, 80 Coins | 1 Coins | - | - | - | +30 simpanan energi | - |
| **Gudang** | Energi | 40 kayu, 20 batu, 60 Coins | 1 Coins | 1 | - | - | +200 stok | - |
| **Taman** | Sosial | 10 kayu, 25 Coins | 1 Coins | - | - | - | - | kepuasan +2, lingkungan +3 |
| **Klinik** | Sosial | 20 kayu, 20 batu, 90 Coins | 3 Coins | 2 | - | 1 energi | - | kepuasan +3 |
| **Sekolah** | Sosial | 30 kayu, 20 batu, 100 Coins | 3 Coins | 2 | - | 1 energi | - | kepuasan +3 |
| **Pasar** | Sosial | 25 kayu, 70 Coins | 2 Coins | 2 | 8 Coins | 1 energi | - | kepuasan +2 |

## Aturan yang berlaku untuk semua bangunan

- **Jalan:** bangunan yang menempel jalan (atas, bawah, kiri, kanan) menghasilkan +20%. Di mode Tiny Territory jalan wajib agar bangunan beroperasi.
- **Pekerja:** warga mengisi lowongan menurut prioritas: Apartemen > Klinik > Sekolah > Rumah > Ladang > Kebun Buah > Pembangkit > Penggergajian > Tambang Batu > Gudang > Pasar > Bengkel > Baterai > Taman.
- **Energi:** pembangkit diproses lebih dulu; bangunan yang butuh energi tetapi kekurangan akan berhenti (tanda abu-abu).
- **Fasilitas sosial:** tiap 10 warga butuh 1 fasilitas (Taman, Klinik, Sekolah, atau Pasar), jika kurang kepuasan turun.
- **Menghapus:** bangunan mengembalikan 50% biaya (dibulatkan ke bawah). Pohon memberi 5 kayu, batu memberi 4 batu.
