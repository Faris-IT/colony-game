// Population Boom: pertumbuhan cepat; pekerjaan, makanan, rumah, dan fasilitas harus mengejar.
(function(){
  CONFIG.modes.boom = {id:'boom', width:20, height:14, startResources:{food:100, wood:200, stone:100, coins:500, energy:0},
    startPopulation:10, treeDensity:0.08, rockDensity:0.04,
    preset:[{x:9,y:6,type:'house'},{x:10,y:6,type:'house'},{x:11,y:6,type:'house'},{x:9,y:7,type:'farm'},{x:10,y:7,type:'farm'}],
    rules:{growth:3, unemployment:true}};
  Modes.boom = {
    id:'boom', name:'Population Boom', desc:'Capai 100 penduduk dengan kepuasan 75%.', diff:'Sulit',
    targetPop:100, targetSat:75, hungerLimit:5,
    introHtml(){ return `<h2>${this.name}</h2><p>Penduduk tumbuh cepat selama rumah masih muat dan warga puas. Tapi warga butuh makanan, pekerjaan (pengangguran menurunkan kepuasan), dan fasilitas sosial.</p><p>Menang: ${this.targetPop} penduduk dengan kepuasan minimal ${this.targetSat}%.</p>`; },
    goals(S){ return [{label:'Penduduk', cur:S.res.population, target:this.targetPop, ok:S.res.population >= this.targetPop},
                      {label:'Kepuasan', cur:Math.round(S.satisfaction), target:this.targetSat, ok:S.satisfaction >= this.targetSat}]; },
    evaluate(S){
      if(S.res.population <= 0) return {result:'lose', reason:'Seluruh penduduk telah pergi.'};
      if(S.shortage >= this.hungerLimit) return {result:'lose', reason:'Kelaparan ' + this.hungerLimit + ' hari berturut-turut.'};
      if(this.goals(S).every(g => g.ok)) return {result:'win', reason:'Ledakan penduduk berhasil dikelola.'};
      return null;
    }
  };
})();
