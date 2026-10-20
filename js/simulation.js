// Simulasi satu hari. Aturan khusus mode dibaca dari S.rules.
window.Sim = {
  nearRoad(map, x, y){
    return [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => { const t = MapSystem.get(map, x+dx, y+dy); return t && t.type === 'road'; });
  },
  // Daftar bangunan, urut prioritas, dengan status terhubung jalan dan tenaga kerja.
  makeList(S){
    const R = S.rules, list = [];
    S.map.tiles.forEach((row,y) => row.forEach((t,x) => { if(BUILDINGS[t.type]) list.push({t, x, y, d:BUILDINGS[t.type], active:false}); }));
    list.forEach(b => { b.near = b.t.type !== 'road' && this.nearRoad(S.map, b.x, b.y); b.connected = !R.roadRequired || b.t.type === 'road' || b.near; });
    list.sort((a,b) => (CONFIG.priority[b.t.type]||5) - (CONFIG.priority[a.t.type]||5)); // pekerja diberikan menurut prioritas
    let free = S.res.population;
    list.forEach(b => { b.staffed = !b.t.damaged && b.connected && b.d.workersRequired <= free; if(b.staffed) free -= b.d.workersRequired; });
    list.sort((a,b) => (b.d.production.energy?1:0) - (a.d.production.energy?1:0)); // produksi: pembangkit dulu agar konsumen kebagian energi
    return {list, free};
  },
  // Untuk tampilan: penduduk yang bekerja dan jumlah lowongan
  workers(S){
    const {list, free} = this.makeList(S);
    return {employed: S.res.population - free, jobs: list.reduce((s,b) => s + (!b.t.damaged && b.connected ? b.d.workersRequired : 0), 0)};
  },
  runDay(S){
    const R = S.rules, before = Object.assign({}, S.res);
    const rep = {prod:{}, cons:{}, maint:0, pop:0, notes:[], sales:0, sold:{}};
    Events.run(S, rep);
    const {list, free} = this.makeList(S);
    rep.unemployed = free; rep.employed = S.res.population - free;
    Economy.produce(S, list, rep);
    if(R.sell) Economy.sell(S, rep);
    rep.income = Math.round(S.res.population * CONFIG.taxPerCitizen * S.satisfaction / 70 * (R.taxMult || 1)); S.res.coins += rep.income;
    Economy.payMaintenance(S.res, list, rep, R.maintMult || 1);
    S.env = Math.max(0, Math.min(100, Math.round(45 + Economy.sumActive(list,'effects','environment') + S.map.tiles.flat().filter(t => t.type === 'tree').length/2)));
    Population.update(S, list, rep);
    S.greenStreak = (S.satisfaction >= 80 && S.env >= 85) ? S.greenStreak + 1 : 0;
    const essOk = ['apartment','clinic','school'].every(id => list.filter(b => b.t.type === id).every(b => b.active)) && list.some(b => b.t.type === 'clinic');
    S.energyStreak = (essOk && !rep.energyShort) ? S.energyStreak + 1 : 0;
    rep.env = S.env;
    rep.storageCap = Economy.clampStorage(S.res, list);
    S.foodStreak = (S.shortage === 0 && S.res.food >= S.res.population) ? S.foodStreak + 1 : 0;
    S.debtStreak = S.res.coins < 0 ? S.debtStreak + 1 : 0;
    S.stats.peakPop = Math.max(S.stats.peakPop, S.res.population);
    rep.delta = {}; ['food','wood','stone','coins','energy'].forEach(k => rep.delta[k] = S.res[k] - before[k]);
    S.profitStreak = rep.delta.coins > 0 ? S.profitStreak + 1 : 0;
    rep.active = list.filter(b => b.active).length;
    rep.prodTotal = Object.entries(rep.prod).reduce((s,[k,v]) => s + (k === 'coins' ? 0 : v), 0);
    rep.idle = list.filter(b => b.t.status !== 'ok').length;
    // Riwayat harian untuk statistik (produksi, konsumsi, biaya bangun, stok)
    const hr = {};
    ['food','wood','stone','coins','energy'].forEach(k => {
      let p = rep.prod[k] || 0, c = (rep.cons[k] || 0) + (rep.sold[k] || 0);
      if(k === 'coins'){ p += rep.income + rep.sales; c = rep.maint; }
      hr[k] = {p, c, b:S.spent[k] || 0, s:S.res[k]};
    });
    S.history.push({day:S.day, r:hr, pop:S.res.population, emp:rep.employed, cap:rep.cap, sat:Math.round(S.satisfaction)});
    if(S.history.length > 60) S.history.shift();
    S.spent = {};
    rep.day = S.day; S.day++; S.lastReport = rep;
    if(S.res.coins < 0) rep.notes.push('Kas minus. Kurangi biaya atau tambah pendapatan.');
    if(rep.idle) rep.notes.push(rep.idle + ' bangunan tidak beroperasi (arahkan kursor ke bangunan abu-abu).');
    return rep;
  }
};
