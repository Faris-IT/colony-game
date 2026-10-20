// Kejadian harian: bencana, gangguan energi, pertumbuhan permintaan, kekeringan, ekspansi Endless.
window.Events = {
  run(S, rep){
    const R = S.rules, day = S.day; S.dayMod = {};
    if(S.drought > 0){ S.dayMod.food = 0.5; S.drought--; rep.notes.push('Musim kering: hasil ladang separuh.'); }
    if(R.blackout && day % R.blackout.every === 0){ S.dayMod.power = 0.5; rep.notes.push('Gangguan jaringan: output pembangkit separuh hari ini.'); }
    if(R.demandGrowth && day % R.demandGrowth.every === 0 && this.spawn(S, 'apartment')) rep.notes.push('Distrik baru: apartemen baru butuh energi.');
    if(R.disasters && R.disasters.days.includes(day)) this.storm(S, rep, R.disasters.count);
    if(R.endless && day % R.endless.every === 0) this.endless(S, rep);
  },
  spawn(S, id){
    const free = []; S.map.tiles.forEach((row,y) => row.forEach((t,x) => { if(t.type === 'empty' && !t.hidden && !t.site) free.push(t); }));
    if(!free.length) return false;
    const t = free[Math.floor(Math.random()*free.length)]; t.type = id; t.status = null; return true;
  },
  storm(S, rep, n){
    const c = []; S.map.tiles.forEach(row => row.forEach(t => { if(BUILDINGS[t.type] && t.type !== 'road' && !t.damaged) c.push(t); }));
    c.sort(() => Math.random() - 0.5);
    const hit = c.slice(0, n); hit.forEach(t => t.damaged = true);
    rep.notes.push((S.day % 2 ? 'Kebakaran' : 'Badai') + ' merusak ' + hit.length + ' bangunan. Pakai alat Perbaiki.');
  },
  endless(S, rep){
    const m = S.map, E = S.rules.endless;
    if(m.w < E.maxW){ MapSystem.expand(m, 2, 2, 0.1, 0.05); MapSystem.addFertile(m, 1); rep.expanded = true; rep.notes.push('Peta diperluas.'); }
    S.costMult = Math.min(3, Math.round(S.costMult * 1.08 * 100) / 100); rep.notes.push('Biaya bangunan naik menjadi ' + Math.round(S.costMult*100) + '%.');
    if(Math.random() < 0.5){ S.drought = 3; rep.notes.push('Musim kering datang.'); }
  }
};
