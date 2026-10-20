// Endless Settlement: tanpa akhir. Peta diperluas, biaya naik, kekeringan datang, lahan subur terbatas.
(function(){
  const score = S => { const r = S.lastReport; return S.res.population*10 + (r ? r.active*5 + r.prodTotal*2 : 0) + Math.round(S.satisfaction)*2 + (S.day-1)*20; };
  CONFIG.modes.endless = {id:'endless', width:12, height:9, startResources:{food:60, wood:100, stone:50, coins:400, energy:0},
    startPopulation:5, treeDensity:0.12, rockDensity:0.06, fertileSeeds:3,
    rules:{fertileOnly:true, endless:{every:10, maxW:24}}};
  Modes.endless = {
    id:'endless', name:'Endless Settlement', desc:'Tanpa akhir. Kejar skor dan hari bertahan.', diff:'Sulit',
    score, debtDays:7, hungerLimit:6,
    introHtml(){ return `<h2>${this.name}</h2><p>Tidak ada garis akhir. Setiap 10 hari peta diperluas, biaya bangunan naik 8% (maksimal 300%, bahan maksimal 150 per bangunan), dan kadang musim kering datang. Ladang di luar lahan subur (bertanda bunga) hanya menghasilkan 60%.</p><p>Kalah jika penduduk habis, bangkrut ${this.debtDays} hari, atau kelaparan ${this.hungerLimit} hari. Kejar skor tertinggi.</p>`; },
    goals(S){ return [{label:'Skor', text:String(score(S)), ok:false}, {label:'Hari bertahan', text:String(S.day-1), ok:false},
                      {label:'Biaya bangunan', text:Math.round(S.costMult*100) + '%', ok:false}]; },
    evaluate(S){
      const end = r => ({result:'lose', reason:r + ' Skor akhir ' + score(S) + ', bertahan ' + (S.day-1) + ' hari.'});
      if(S.res.population <= 0) return end('Seluruh penduduk telah pergi.');
      if(S.debtStreak >= this.debtDays) return end('Bangkrut ' + this.debtDays + ' hari berturut-turut.');
      if(S.shortage >= this.hungerLimit) return end('Kelaparan berkepanjangan.');
      return null;
    }
  };
})();
