// Simulasi satu hari (versi dasar Tahap 2; laporan lengkap dan menang/kalah di Tahap 3).
window.Sim = {
  runDay(S){
    const list = [], rep = {prod:{}, cons:{}, maint:0, pop:0, notes:[]};
    S.map.tiles.forEach(row => row.forEach(t => { if(BUILDINGS[t.type]) list.push({t, d:BUILDINGS[t.type], active:false}); }));
    list.sort((a,b) => (b.d.production.energy?1:0) - (a.d.production.energy?1:0)); // pembangkit dulu
    let free = S.res.population;
    list.forEach(b => { b.staffed = b.d.workersRequired <= free; if(b.staffed) free -= b.d.workersRequired; });
    Economy.produce(S.res, list, rep);
    Economy.payMaintenance(S.res, list, rep);
    Population.update(S, list, rep);
    rep.storageCap = Economy.clampStorage(S.res, list);
    rep.idle = list.filter(b => b.t.status !== 'ok').length;
    rep.day = S.day; S.day++; S.lastReport = rep;
    if(S.res.coins < 0) rep.notes.push('Kas minus. Kurangi biaya atau tambah pendapatan.');
    if(rep.idle) rep.notes.push(rep.idle+' bangunan tidak beroperasi (kurang pekerja atau bahan).');
    return rep;
  }
};
