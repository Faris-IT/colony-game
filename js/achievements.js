// 12 pencapaian. Disimpan lewat Store.
window.Achievements = {
  list:[
    {id:'first', name:'First Settlement', desc:'Bangun bangunan pertama', test:S => S.stats.built >= 1},
    {id:'growing', name:'Growing Community', desc:'Capai 20 penduduk', test:S => S.res.population >= 20},
    {id:'food', name:'Food Security', desc:'Miliki stok makanan untuk 10 hari', test:S => S.res.population > 0 && S.res.food >= S.res.population*10},
    {id:'profit', name:'Profitable Colony', desc:'Catat laba positif selama 10 hari', test:S => S.profitStreak >= 10},
    {id:'green', name:'Green Future', desc:'Capai target lingkungan Green Colony', test:(S,c) => S.modeId === 'green' && c.result === 'win'},
    {id:'survivor', name:'Survivor', desc:'Bertahan selama 30 hari', test:S => S.day-1 >= 30 && S.res.population > 0},
    {id:'planner', name:'Efficient Planner', desc:'Selesaikan Tiny Territory', test:(S,c) => S.modeId === 'tiny' && c.result === 'win'},
    {id:'explorer', name:'Explorer', desc:'Buka 20 petak peta', test:S => (S.stats.tilesOpened||0) >= 20},
    {id:'energy', name:'Energy Stable', desc:'Jaga energi stabil selama 15 hari', test:S => S.energyStreak >= 15},
    {id:'master', name:'Master Builder', desc:'Bangun 10 jenis bangunan', test:() => Store.data.stats.types.length >= 10},
    {id:'campaign', name:'Campaign Finisher', desc:'Selesaikan seluruh misi Campaign', test:() => Store.data.campaign.done.length >= CampaignLevels.length},
    {id:'legend', name:'Colony Legend', desc:'Capai milestone skor keseluruhan 5.000', test:() => Store.data.stats.totalScore >= 5000}
  ],
  check(S, c){
    c = c || {}; const out = [];
    this.list.forEach(a => {
      if(Store.data.ach[a.id]) return;
      let ok = false; try { ok = a.test(S, c); } catch(e) {}
      if(ok){ Store.data.ach[a.id] = Date.now(); out.push(a.name); (S.newAch = S.newAch || []).push(a.name); }
    });
    if(out.length){ Store.save(); UI.toast('Pencapaian terbuka: ' + out.join(', ')); }
    return out;
  }
};
