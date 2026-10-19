// Mode Tutorial: langkah demi langkah untuk pemain baru (di luar 12 mode utama).
(function(){
  const count = (S,id) => S.map.tiles.flat().filter(t => t.type === id).length;
  Modes.tutorial = {
    id:'tutorial', name:'Tutorial', desc:'Belajar langkah demi langkah.', diff:'Mudah',
    steps:[
      {tool:'house',  text:'Pilih Rumah di panel kanan, lalu klik tanah kosong. Rumah menambah tempat tinggal warga.', done:S => count(S,'house') >= 1},
      {tool:'farm',   text:'Bangun Ladang. Ladang menghasilkan makanan, tetapi butuh 2 warga sebagai pekerja.', done:S => count(S,'farm') >= 1},
      {tool:'demolish', text:'Pilih Hapus / bersihkan, lalu klik 2 pohon atau batu. Ini memberi kayu atau batu gratis.', done:S => S.stats.cleared >= 2},
      {tool:'sawmill', text:'Bangun Penggergajian. Ia memproduksi kayu tiap hari dan hanya butuh Coins untuk dibangun.', done:S => count(S,'sawmill') >= 1},
      {tool:null,     text:'Tekan Hari berikutnya. Produksi, makan, dan biaya diproses. Baca laporannya.', done:S => S.day >= 2},
      {tool:null,     text:'Jalankan 3 hari lagi. Perhatikan makanan dan jumlah penduduk.', done:S => S.day >= 5},
      {tool:'house',  text:'Penduduk hanya bertambah jika rumah masih muat. Bangun 1 rumah lagi.', done:S => count(S,'house') >= 2},
      {tool:'power',  text:'Bangun Pembangkit. Energi dipakai Apartemen, Bengkel, Klinik, Sekolah, dan Pasar.', done:S => count(S,'power') >= 1},
      {tool:'market', text:'Bangun Pasar. Ia butuh energi dan 2 pekerja, menghasilkan Coins, dan menambah kepuasan.', done:S => count(S,'market') >= 1},
      {tool:'park',   text:'Bangun Taman. Kepuasan tinggi menaikkan pajak dan mempercepat pertumbuhan penduduk.', done:S => count(S,'park') >= 1},
      {tool:null,     text:'Capai 10 penduduk. Tambah rumah dan ladang bila perlu, lalu jalankan hari.', done:S => S.res.population >= 10}
    ],
    current(S){ return this.steps.findIndex(s => !s.done(S)); },
    hint(S){ const i = this.current(S); return i < 0 ? null : this.steps[i].tool; },
    goals(S){
      const i = this.current(S), n = i < 0 ? this.steps.length : i + 1;
      return this.steps.slice(Math.max(0, n-3), n).map((s, k) => ({label:'Langkah ' + (Math.max(0,n-3)+k+1) + ': ' + s.text, ok:s.done(S)}));
    },
    introHtml(){ return `<h2>Tutorial</h2><p>Kamu mengelola koloni kecil. Setiap hari warga makan dan bangunan membayar biaya. Ikuti langkah di panel Tujuan; tombol yang perlu ditekan akan diberi bingkai kuning.</p>`; },
    evaluate(S){
      if(S.res.population <= 0) return {result:'lose', reason:'Penduduk habis. Ulangi tutorial dan jaga makanan tetap cukup.'};
      if(this.current(S) < 0) return {result:'win', reason:'Kamu sudah menguasai dasar membangun, produksi, energi, dan kepuasan warga.'};
      return null;
    }
  };
})();
