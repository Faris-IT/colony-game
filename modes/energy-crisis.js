// Energy Crisis: jaga pasokan energi. Fasilitas prioritas rendah mati duluan; ada gangguan jaringan dan permintaan yang terus naik.
(function(){
  CONFIG.modes.energy = {id:'energy', width:16, height:12, startResources:{food:80, wood:120, stone:80, coins:500, energy:0},
    startPopulation:15, treeDensity:0.1, rockDensity:0.05,
    preset:[{x:7,y:5,type:'apartment'},{x:8,y:5,type:'apartment'},{x:8,y:7,type:'apartment'},{x:7,y:6,type:'clinic'},{x:8,y:6,type:'school'},{x:6,y:5,type:'power'},
            {x:9,y:5,type:'market'},{x:6,y:6,type:'workshop'},{x:9,y:7,type:'workshop'},{x:9,y:6,type:'farm'},{x:6,y:7,type:'farm'},{x:7,y:7,type:'farm'}],
    rules:{blackout:{every:7}, demandGrowth:{every:5}}};
  Modes.energy = {
    id:'energy', name:'Energy Crisis', desc:'Jaga energi stabil 15 hari. Permintaan terus naik.', diff:'Sulit',
    days:15, debtDays:5,
    introHtml(){ return `<h2>${this.name}</h2><p>Apartemen, klinik, sekolah, pasar, dan bengkel butuh energi. Saat energi kurang, fasilitas prioritas rendah (bengkel, pasar) berhenti lebih dulu. Setiap 5 hari muncul apartemen baru, dan setiap 7 hari terjadi gangguan jaringan (output pembangkit separuh). Baterai menyimpan kelebihan energi.</p><p>Menang: ${this.days} hari berturut-turut tanpa kekurangan energi dan semua apartemen, klinik, dan sekolah aktif. Pembangkit juga memakai biaya harian, jadi jangan berlebihan.</p>`; },
    goals(S){ return [{label:'Hari stabil berturut-turut', cur:S.energyStreak, target:this.days, ok:S.energyStreak >= this.days},
                      {label:'Energi tersimpan', text:String(S.res.energy), ok:false}]; },
    evaluate(S){
      if(S.res.population <= 0) return {result:'lose', reason:'Seluruh penduduk telah pergi.'};
      if(S.debtStreak >= this.debtDays) return {result:'lose', reason:'Bangkrut ' + this.debtDays + ' hari berturut-turut.'};
      if(S.energyStreak >= this.days) return {result:'win', reason:'Jaringan energi stabil.'};
      return null;
    }
  };
})();
