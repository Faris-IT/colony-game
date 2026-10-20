# Catatan keseimbangan

> Semua angka ekonomi adalah **nilai awal yang diuji**, bukan angka yang terbukti seimbang untuk semua gaya bermain. Bot uji adalah pemain sederhana: ia menunjukkan bahwa tiap mode **dapat** dimenangkan dan bahwa pemain yang tidak berbuat apa-apa **tidak** menang. Ia bukan pengganti uji oleh manusia.

## Cara menguji
```bash
node tests/run.js -v
```
`tests/balance.test.js` menjalankan bot pada 5 peta acak (seed tetap) per mode. Syarat lulus: menang di minimal 4 dari 5 peta dalam batas hari, dan pemain pasif tidak pernah menang.

## Hasil terakhir (bot sederhana)
| Mode | Hasil bot | Batas uji |
|---|---|---|
| Classic | menang hari 28 | 40 |
| Tutorial | menang hari 5 | 30 |
| Speed Builder | menang hari 22 | 30 |
| Survival | menang hari 60 | 60 |
| Economic Empire | menang hari 80 | 120 |
| Population Boom | menang hari 53 | 90 |
| Green Colony | menang hari 19-21 | 50 |
| Disaster Response | menang hari 20 (4 dari 5 peta) | 30 |
| Tiny Territory | menang hari 53 | 70 |
| Frontier Explorer | menang hari 35 | 60 |
| Energy Crisis | menang hari 15 | 40 |
| Endless Settlement | bertahan 150 hari (5 dari 5) | - |
| Campaign 1-6 | menang hari 7, 29, 8, 26-31, 42, 15 | 30, 35, 35, 45, 45, 25 |

Catatan yang perlu diketahui:
- **Survival** dimenangkan bot dengan kas sudah minus: modenya sengaja ketat. Jika terasa terlalu berat, kurangi `maintMult` (saat ini 1,5) di `modes/survival.js`.
- **Disaster Response** gagal di 1 dari 5 peta karena badai acak mengenai bangunan penting lebih awal. Ini sinyal bahwa modenya sempit toleransinya.
- **Classic** dan **Energy Crisis** relatif mudah bagi bot yang membangun proaktif. Pemain manusia biasanya lebih lambat, tetapi mode Energy Crisis bisa dibuat lebih sulit dengan mempercepat `demandGrowth`.
- Hasil bot hampir sama di semua seed karena bot membangun di petak kosong pertama. Variasi peta lebih terasa bagi pemain manusia.

## Riwayat penyesuaian
| Perubahan | Alasan |
|---|---|
| Pajak warga 1 Coins per warga per hari | Tanpa pemasukan dasar, Classic tidak bisa dimenangkan |
| Penggergajian dan Tambang hanya butuh Coins | Menghindari kebuntuan: tidak punya kayu berarti tidak bisa membangun sumber kayu |
| Energi dan fasilitas sosial dibuat berfungsi | Sebelumnya tidak ada gunanya |
| Target Speed Builder 800 → 700 | Bot hanya mencapai 778 di hari 30 |
| Disaster Response: modal 300 Coins, pajak 1,3x, bencana hari 4/8/12 | Versi pertama tidak bisa dipulihkan karena kas habis untuk perbaikan |
| Skor lingkungan dasar 60 → 45 | Green Colony menang terlalu mudah |
| Endless: bahan maks 150, pengali biaya maks 3x | Biaya Gudang melewati batas stok 200 sehingga tidak bisa membangun apa pun |
| Apartemen tanpa energi tetap menampung 6 | Apartemen tanpa energi tidak dihuni siapa pun |
| Pekerja diberikan menurut prioritas, pembangkit tidak diprioritaskan | Pembangkit menyedot pekerja ladang dan koloni kelaparan |
| Penduduk dibatasi kapasitas setelah semua kejadian | Uji acak menemukan penduduk bisa melebihi kapasitas saat kelaparan |
| Campaign: target dan batas waktu disetel ulang | Misi 1 terlalu sulit, Misi 3 langsung selesai tanpa usaha |

## Yang belum diuji
- **Tampilan di browser sungguhan** (desktop dan mobile), termasuk jalan yang menyambung, kabut, tanda panah tutorial, dan grafik statistik. Uji otomatis memakai DOM tiruan.
- Kenyamanan sentuhan layar dan performa di perangkat lemah.
- Keseimbangan terhadap pemain manusia yang bermain beragam.
