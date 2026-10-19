// Frontier Explorer: peta tertutup kabut; kirim ekspedisi untuk menemukan lokasi sumber daya khusus.
(function(){
  const sites = S => S.map.tiles.flat().filter(t => t.site);
  CONFIG.modes.frontier = {id:'frontier', width:18, height:12, startResources:{food:80, wood:100, stone:40, coins:300, energy:0},
    startPopulation:6, treeDensity:0.1, rockDensity:0.05,
    fog:{open:{x0:6, y0:4, x1:11, y1:7}, sites:[[1,1],[16,2],[9,10]]}, rules:{fog:true}};
  Modes.frontier = {
    id:'frontier', name:'Frontier Explorer', desc:'Jelajahi wilayah dan temukan 3 lokasi sumber daya khusus.', diff:'Sedang',
    debtDays:5,
    introHtml(){ return `<h2>${this.name}</h2><p>Sebagian peta tertutup kabut. Pakai alat Kirim ekspedisi pada petak gelap di tepi wilayah terbuka (biaya makanan dan Coins, makin mahal tiap ekspedisi). Bisa ditemukan pohon, batu, lahan subur (ladang x1,5), rawa yang tak bisa dibangun, atau lokasi khusus (produksi x2).</p><p>Menang: temukan 3 lokasi khusus dan bangun fasilitas di masing-masing.</p>`; },
    goals(S){ const s = sites(S), found = s.filter(t => !t.hidden).length, built = s.filter(t => BUILDINGS[t.type]).length;
      return [{label:'Lokasi ditemukan', cur:found, target:s.length, ok:found === s.length},
              {label:'Fasilitas di lokasi', cur:built, target:s.length, ok:built === s.length}]; },
    evaluate(S){
      if(S.res.population <= 0) return {result:'lose', reason:'Seluruh penduduk telah pergi.'};
      if(S.debtStreak >= this.debtDays) return {result:'lose', reason:'Bangkrut ' + this.debtDays + ' hari berturut-turut.'};
      if(this.goals(S).every(g => g.ok)) return {result:'win', reason:'Wilayah baru berhasil dijelajahi dan dibangun.'};
      return null;
    }
  };
})();
