// Simulasi satu hari. Aturan khusus mode dibaca dari S.rules.
window.Sim = {
  nearRoad(map, x, y){
    return [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => { const t = MapSystem.get(map, x+dx, y+dy); return t && t.type === 'road'; });
  },
  runDay(S){
    const R = S.rules, before = Object.assign({}, S.res), list = [];
    const rep = {prod:{}, cons:{}, maint:0, pop:0, notes:[], sales:0, sold:{}};
    S.map.tiles.forEach((row,y) => row.forEach((t,x) => { if(BUILDINGS[t.type]) list.push({t, x, y, d:BUILDINGS[t.type], active:false}); }));
    list.forEach(b => { b.connected = !R.roadRequired || b.t.type === 'road' || this.nearRoad(S.map, b.x, b.y); });
    list.sort((a,b) => (b.d.production.energy?1:0) - (a.d.production.energy?1:0)); // pembangkit dulu
    let free = S.res.population;
    list.forEach(b => { b.staffed = b.connected && b.d.workersRequired <= free; if(b.staffed) free -= b.d.workersRequired; });
    rep.unemployed = free;
    Economy.produce(S, list, rep);
    if(R.sell) Economy.sell(S, rep);
    rep.income = Math.round(S.res.population * CONFIG.taxPerCitizen * S.satisfaction / 70 * (R.taxMult || 1)); S.res.coins += rep.income;
    Economy.payMaintenance(S.res, list, rep, R.maintMult || 1);
    Population.update(S, list, rep);
    rep.storageCap = Economy.clampStorage(S.res, list);
    S.foodStreak = (S.shortage === 0 && S.res.food >= S.res.population) ? S.foodStreak + 1 : 0;
    S.debtStreak = S.res.coins < 0 ? S.debtStreak + 1 : 0;
    S.stats.peakPop = Math.max(S.stats.peakPop, S.res.population);
    rep.delta = {}; ['food','wood','stone','coins','energy'].forEach(k => rep.delta[k] = S.res[k] - before[k]);
    S.profitStreak = rep.delta.coins > 0 ? S.profitStreak + 1 : 0;
    rep.active = list.filter(b => b.active).length;
    rep.prodTotal = Object.entries(rep.prod).reduce((s,[k,v]) => s + (k === 'coins' ? 0 : v), 0);
    rep.idle = list.filter(b => b.t.status !== 'ok').length;
    rep.day = S.day; S.day++; S.lastReport = rep;
    if(S.res.coins < 0) rep.notes.push('Kas minus. Kurangi biaya atau tambah pendapatan.');
    if(rep.idle) rep.notes.push(rep.idle + ' bangunan tidak beroperasi (arahkan kursor ke bangunan abu-abu).');
    return rep;
  }
};
