// Colony Campaign: rangkaian misi berurutan. Tiap misi = aturan dan target berbeda.
(function(){
  const VITAL = ['house','farm','clinic','power'];
  const vital = S => S.map.tiles.flat().filter(t => t.damaged && VITAL.includes(t.type)).length;
  const sites = S => S.map.tiles.flat().filter(t => t.site);
  const G = {
    pop:(S,v) => [{label:'Penduduk', cur:S.res.population, target:v, ok:S.res.population >= v}],
    coins:(S,v) => [{label:'Coins', cur:Math.max(0,S.res.coins), target:v, ok:S.res.coins >= v}],
    foodStreak:(S,v) => [{label:'Makanan aman (hari berturut-turut)', cur:S.foodStreak, target:v, ok:S.foodStreak >= v}],
    energyStreak:(S,v) => [{label:'Hari energi stabil berturut-turut', cur:S.energyStreak, target:v, ok:S.energyStreak >= v}],
    greenStreak:(S,v) => [{label:'Hari hijau berturut-turut', cur:S.greenStreak, target:v, ok:S.greenStreak >= v},
                          {label:'Lingkungan / Kepuasan', text:S.env + ' / ' + Math.round(S.satisfaction) + '%', ok:false, info:true}],
    sites:(S,v) => { const s = sites(S); return [{label:'Lokasi ditemukan', cur:s.filter(t => !t.hidden).length, target:v, ok:s.filter(t => !t.hidden).length >= v},
                                                  {label:'Fasilitas di lokasi', cur:s.filter(t => BUILDINGS[t.type]).length, target:v, ok:s.filter(t => BUILDINGS[t.type]).length >= v}]; },
    vital:S => [{label:'Bangunan vital rusak', text:String(vital(S)), ok:vital(S) === 0}],
    day:(S,v) => [{label:'Hari bertahan', cur:S.day-1, target:v, ok:S.day-1 >= v}]
  };
  window.Campaign = {
    levels: CampaignLevels,
    config(i){ const k = Math.max(0, Math.min(+i || 0, CampaignLevels.length-1)), L = CampaignLevels[k];
      return Object.assign({}, L, {id:'campaign', mission:L, missionIndex:k}); }
  };
  Modes.campaign = {
    id:'campaign', name:'Colony Campaign', desc:'6 misi berurutan, masing-masing memperkenalkan mekanik baru.', diff:'Bertahap',
    hint(S){ return S.rules.repair && vital(S) ? 'repair' : null; },
    introHtml(S){ const L = S.mission; return `<h2>Misi ${S.missionIndex+1}: ${L.name}</h2><p><b>Mekanik:</b> ${L.mech}</p><p>${L.intro}</p>`; },
    goals(S){
      const L = S.mission, g = [].concat(...L.targets.map(t => G[t.t](S, t.v)));
      g.push({label:'Sisa waktu', text:Math.max(0, L.limit - (S.day-1)) + ' hari', ok:false, info:true}); return g;
    },
    evaluate(S){
      const L = S.mission, req = [].concat(...L.targets.map(t => G[t.t](S, t.v))).filter(g => !g.info);
      if(S.res.population <= 0) return {result:'lose', reason:'Seluruh penduduk telah pergi.'};
      if(S.debtStreak >= 5) return {result:'lose', reason:'Bangkrut 5 hari berturut-turut.'};
      if(req.every(g => g.ok)) return {result:'win', reason:'Misi "' + L.name + '" selesai.'};
      if(S.day-1 >= L.limit) return {result:'lose', reason:'Batas waktu misi habis.'};
      return null;
    }
  };
})();
