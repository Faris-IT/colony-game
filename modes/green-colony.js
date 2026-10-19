// Green Colony: pertumbuhan tanpa merusak lingkungan. Skor lingkungan dari taman, pohon, dan polusi industri.
(function(){
  CONFIG.modes.green = {id:'green', width:16, height:12, startResources:{food:60, wood:120, stone:60, coins:400, energy:0},
    startPopulation:8, treeDensity:0.14, rockDensity:0.05,
    preset:[{x:7,y:5,type:'house'},{x:8,y:5,type:'house'},{x:7,y:6,type:'farm'},{x:8,y:6,type:'sawmill'}],
    rules:{green:true, showEnv:true, taxMult:0.85}};
  Modes.green = {
    id:'green', name:'Green Colony', desc:'Tumbuh tanpa merusak lingkungan.', diff:'Sedang',
    targetSat:80, targetEnv:85, days:7, debtDays:5,
    introHtml(){ return `<h2>${this.name}</h2><p>Industri menghasilkan pendapatan tetapi menurunkan kualitas lingkungan. Taman dan pohon menaikkannya (menebang pohon menurunkannya). Skor dasar 45; lingkungan di bawah 60 menurunkan kepuasan warga.</p><p>Menang: kepuasan minimal ${this.targetSat}% dan skor lingkungan minimal ${this.targetEnv} selama ${this.days} hari berturut-turut.</p>`; },
    goals(S){ return [{label:'Kepuasan', cur:Math.round(S.satisfaction), target:this.targetSat, ok:S.satisfaction >= this.targetSat},
                      {label:'Skor lingkungan', cur:S.env, target:this.targetEnv, ok:S.env >= this.targetEnv},
                      {label:'Hari berturut-turut', cur:S.greenStreak, target:this.days, ok:S.greenStreak >= this.days}]; },
    evaluate(S){
      if(S.res.population <= 0) return {result:'lose', reason:'Seluruh penduduk telah pergi.'};
      if(S.debtStreak >= this.debtDays) return {result:'lose', reason:'Bangkrut ' + this.debtDays + ' hari berturut-turut.'};
      if(S.greenStreak >= this.days) return {result:'win', reason:'Koloni hijau yang makmur.'};
      return null;
    }
  };
})();
