// Survival Colony: bertahan 60 hari dengan persediaan terbatas dan kayu/batu alam yang bisa habis.
(function(){
  CONFIG.modes.survival = {id:'survival', width:14, height:10, startResources:{food:30, wood:50, stone:10, coins:150, energy:0},
    startPopulation:8, treeDensity:0.14, rockDensity:0.08,
    preset:[{x:6,y:4,type:'house'},{x:7,y:4,type:'house'},{x:6,y:5,type:'farm'}],
    rules:{maintMult:1.5, taxMult:0.7}, natural:{wood:160, stone:60}};
  Modes.survival = {
    id:'survival', name:'Survival Colony', desc:'Bertahan 60 hari. Kayu dan batu alam terbatas.', diff:'Sulit',
    days:60, hungerLimit:5,
    introHtml(){ return `<h2>${this.name}</h2><p>Bertahanlah ${this.days} hari. Persediaan awal tipis, biaya bangunan 1,5 kali lipat, pajak lebih kecil, dan cadangan kayu serta batu alam bisa habis (penggergajian dan tambang berhenti saat habis).</p><p>Kalah jika penduduk habis atau kelaparan ${this.hungerLimit} hari berturut-turut.</p>`; },
    goals(S){ return [{label:'Hari bertahan', cur:S.day-1, target:this.days, ok:S.day-1 >= this.days},
                      {label:'Kayu alam tersisa', text:String(S.natural.wood), ok:false},
                      {label:'Batu alam tersisa', text:String(S.natural.stone), ok:false}]; },
    evaluate(S){
      if(S.res.population <= 0) return {result:'lose', reason:'Seluruh penduduk telah pergi.'};
      if(S.shortage >= this.hungerLimit) return {result:'lose', reason:'Kebutuhan dasar tidak terpenuhi selama ' + this.hungerLimit + ' hari.'};
      if(S.day-1 >= this.days) return {result:'win', reason:'Koloni bertahan ' + this.days + ' hari.'};
      return null;
    }
  };
})();
