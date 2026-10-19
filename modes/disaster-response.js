// Disaster Response: mulai dengan bangunan rusak; badai dan kebakaran merusak lebih banyak. Pulihkan bangunan vital.
(function(){
  const VITAL = ['house','farm','clinic','power'];
  const vitalDamaged = S => S.map.tiles.flat().filter(t => t.damaged && VITAL.includes(t.type)).length;
  CONFIG.modes.disaster = {id:'disaster', width:14, height:10, startResources:{food:40, wood:40, stone:20, coins:300, energy:0},
    startPopulation:8, treeDensity:0.12, rockDensity:0.06,
    preset:[{x:6,y:4,type:'house'},{x:7,y:4,type:'house'},{x:8,y:4,type:'house',damaged:true},{x:6,y:5,type:'farm'},{x:7,y:5,type:'farm',damaged:true},
            {x:6,y:6,type:'clinic',damaged:true},{x:7,y:6,type:'power',damaged:true},{x:8,y:5,type:'sawmill'}],
    rules:{repair:true, taxMult:1.3, disasters:{days:[4,8,12], count:2}}};
  Modes.disaster = {
    id:'disaster', name:'Disaster Response', desc:'Pulihkan koloni setelah serangkaian bencana.', diff:'Sulit',
    days:20, limit:30,
    hint(S){ return vitalDamaged(S) ? 'repair' : null; },
    introHtml(){ return `<h2>${this.name}</h2><p>Koloni dimulai dengan bangunan rusak (bergaris merah) dan stok rendah. Pajak naik 30% selama masa pemulihan. Badai dan kebakaran masih akan datang di hari 4, 8, dan 12.</p><p>Gunakan alat Perbaiki (biaya 50% harga bangun). Menang: semua bangunan vital (rumah, ladang, klinik, pembangkit) pulih dan koloni bertahan ${this.days} hari. Kalah jika masih rusak di hari ${this.limit}.</p>`; },
    goals(S){ return [{label:'Bangunan vital rusak', cur:vitalDamaged(S), text:String(vitalDamaged(S)), ok:vitalDamaged(S) === 0},
                      {label:'Hari bertahan', cur:S.day-1, target:this.days, ok:S.day-1 >= this.days}]; },
    evaluate(S){
      if(S.res.population <= 0) return {result:'lose', reason:'Seluruh penduduk telah pergi.'};
      if(S.day-1 >= this.days && vitalDamaged(S) === 0) return {result:'win', reason:'Koloni pulih dan bertahan ' + this.days + ' hari.'};
      if(S.day-1 >= this.limit) return {result:'lose', reason:'Fasilitas vital tidak pulih sebelum batas waktu.'};
      return null;
    }
  };
})();
