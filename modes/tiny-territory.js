// Tiny Territory: peta 8x6; setiap bangunan harus menempel jalan agar beroperasi.
(function(){
  CONFIG.modes.tiny = {id:'tiny', width:8, height:6, startResources:{food:40, wood:80, stone:40, coins:300, energy:0},
    startPopulation:5, treeDensity:0.05, rockDensity:0.03, rules:{roadRequired:true}};
  Modes.tiny = {
    id:'tiny', name:'Tiny Territory', desc:'Peta kecil 8x6. Bangunan harus menempel jalan.', diff:'Sedang',
    targetPop:20, targetFood:80, targetCoins:500, debtDays:5,
    introHtml(){ return `<h2>${this.name}</h2><p>Lahanmu hanya 48 petak. Bangunan hanya beroperasi jika menempel jalan (atas, bawah, kiri, atau kanan), padahal jalan juga memakai petak. Rencanakan tata letak.</p><p>Menang: ${this.targetPop} penduduk, ${this.targetFood} makanan, dan ${this.targetCoins} Coins sekaligus.</p>`; },
    goals(S){ return [{label:'Penduduk', cur:S.res.population, target:this.targetPop, ok:S.res.population >= this.targetPop},
                      {label:'Makanan', cur:S.res.food, target:this.targetFood, ok:S.res.food >= this.targetFood},
                      {label:'Coins', cur:Math.max(0,S.res.coins), target:this.targetCoins, ok:S.res.coins >= this.targetCoins}]; },
    evaluate(S){
      if(S.res.population <= 0) return {result:'lose', reason:'Seluruh penduduk telah pergi.'};
      if(S.debtStreak >= this.debtDays) return {result:'lose', reason:'Bangkrut ' + this.debtDays + ' hari berturut-turut.'};
      if(this.goals(S).every(g => g.ok)) return {result:'win', reason:'Koloni efisien di lahan kecil.'};
      return null;
    }
  };
})();
