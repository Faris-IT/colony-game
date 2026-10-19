// Speed Builder: 30 hari, kejar skor dari penduduk, bangunan aktif, produksi, dan kepuasan.
(function(){
  const score = S => { const r = S.lastReport; return S.res.population*10 + (r ? r.active*5 + r.prodTotal*2 : 0) + Math.round(S.satisfaction)*2; };
  CONFIG.modes.speed = {id:'speed', width:16, height:12, startResources:{food:60, wood:160, stone:80, coins:600, energy:0},
    startPopulation:5, treeDensity:0.1, rockDensity:0.05};
  Modes.speed = {
    id:'speed', name:'Speed Builder', desc:'30 hari untuk meraih skor target sebelum waktu habis.', diff:'Sedang',
    target:700, days:30, score,
    introHtml(){ return `<h2>${this.name}</h2><p>Kamu punya ${this.days} hari. Skor = penduduk, bangunan aktif, produksi harian, dan kepuasan warga. Capai skor ${this.target} sebelum waktu habis untuk menang.</p><p>Modal awal lebih besar dari Classic, jadi bangun cepat dan jaga makanan.</p>`; },
    goals(S){ return [{label:'Skor', cur:score(S), target:this.target, ok:score(S) >= this.target},
                      {label:'Hari', text:Math.min(S.day, this.days) + '/' + this.days, ok:false}]; },
    evaluate(S){
      if(score(S) >= this.target) return {result:'win', reason:'Skor ' + score(S) + ' tercapai di hari ke-' + (S.day-1) + '.'};
      if(S.day > this.days) return {result:'end', reason:'Waktu habis. Skor akhir ' + score(S) + ' dari target ' + this.target + '. Tidak ada penalti.'};
      return null;
    }
  };
})();
