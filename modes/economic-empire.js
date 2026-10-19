// Economic Empire: stok surplus dijual otomatis; kejar 10.000 Coins dengan laba positif.
(function(){
  CONFIG.modes.economic = {id:'economic', width:20, height:14, startResources:{food:60, wood:100, stone:60, coins:600, energy:0},
    startPopulation:8, treeDensity:0.08, rockDensity:0.04,
    preset:[{x:9,y:6,type:'house'},{x:10,y:6,type:'house'},{x:9,y:7,type:'farm'}],
    rules:{sell:true}};
  Modes.economic = {
    id:'economic', name:'Economic Empire', desc:'Jual surplus, capai 10.000 Coins dengan laba positif.', diff:'Sedang',
    coinTarget:10000, profitDays:10, debtLimit:-300,
    introHtml(){ return `<h2>${this.name}</h2><p>Surplus makanan, kayu, dan batu dijual otomatis tiap hari. Menjual banyak sekaligus menurunkan harga, dan gudang memperbesar stok yang bisa ditahan.</p><p>Menang: ${this.coinTarget.toLocaleString('id-ID')} Coins dengan laba bersih positif ${this.profitDays} hari berturut-turut. Kalah jika utang melewati ${Math.abs(this.debtLimit)} Coins.</p>`; },
    goals(S){ return [{label:'Coins', cur:Math.max(0,S.res.coins), target:this.coinTarget, ok:S.res.coins >= this.coinTarget},
                      {label:'Laba positif (hari berturut-turut)', cur:S.profitStreak, target:this.profitDays, ok:S.profitStreak >= this.profitDays}]; },
    evaluate(S){
      if(S.res.population <= 0) return {result:'lose', reason:'Seluruh penduduk telah pergi.'};
      if(S.res.coins < this.debtLimit) return {result:'lose', reason:'Utang melewati batas ' + Math.abs(this.debtLimit) + ' Coins.'};
      if(this.goals(S).every(g => g.ok)) return {result:'win', reason:'Kekaisaran ekonomi terbangun dengan laba yang stabil.'};
      return null;
    }
  };
})();
