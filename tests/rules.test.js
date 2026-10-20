// Checklist pengujian: sistem pembangunan, simulasi dan ekonomi, peta prosedural, keadaan mustahil.
const {game, boot} = require('./harness'), R = require('./report');
R.section('Aturan: sistem pembangunan');
{
  const g = game('classic'), {S, B, ctx} = g;
  S.map.tiles.forEach(r => r.forEach(t => t.type = 'empty')); S.res.wood = 100; S.res.stone = 100; S.res.coins = 1000;
  R.ok(B.place(S, 3, 3, 'house').ok, 'membangun di petak kosong');
  R.ok(!B.place(S, 3, 3, 'farm').ok, 'tidak bisa membangun di petak terisi');
  R.ok(!B.place(S, -1, 0, 'house').ok && !B.place(S, S.map.w, 0, 'house').ok, 'batas wilayah peta berfungsi');
  R.ok(S.res.wood === 80 && S.res.coins === 970, 'biaya dikurangi tepat saat membangun (kayu 80, Coins 970)');
  B.demolish(S, 3, 3);
  R.ok(S.res.wood === 90 && S.res.coins === 985, 'penghapusan mengembalikan 50% biaya');
  const before = Object.assign({}, S.res);
  for(let i = 0; i < 100; i++){ B.place(S, 4, 4, 'sawmill'); B.demolish(S, 4, 4); }
  R.ok(S.res.coins <= before.coins && S.res.wood <= before.wood && S.res.stone <= before.stone, 'bangun-hapus berulang tidak menghasilkan sumber daya gratis');
}
R.section('Aturan: simulasi dan ekonomi');
{
  const g = game('classic'), {S, B, ctx} = g;
  S.map.tiles.forEach(r => r.forEach(t => t.type = 'empty')); S.res.food = 0; S.res.wood = 500; S.res.coins = 1000;
  B.place(S, 1, 1, 'house'); B.place(S, 2, 1, 'farm');
  ctx.Sim.runDay(S);
  R.ok(S.res.food === 1, 'produksi dan konsumsi dihitung sekali per hari (6 produksi - 5 makan = 1, hasil ' + S.res.food + ')');
  let over = 0;
  for(let d = 0; d < 40; d++){ for(const t of ['house','farm','house','farm']) g.b(t); const rep = ctx.Sim.runDay(S); if(S.res.population > rep.cap) over++; }
  R.ok(over === 0, 'penduduk tidak pernah melebihi kapasitas tempat tinggal');
}
{
  const g = game('classic'), {S, ctx} = g;
  S.map.tiles.forEach(r => r.forEach(t => t.type = 'empty')); S.res.coins = 0; S.res.food = 1000; S.res.population = 0;
  const b0 = Object.assign({}, S.res); ctx.Sim.runDay(S);
  R.ok(S.res.coins === 0 && S.res.wood === b0.wood, 'koloni kosong tidak menghasilkan Coins/kayu dari ketiadaan');
}
R.section('Aturan: mode berbeda (minimal 3 unsur dari Classic)');
{
  const base = game('classic'), ids = ['speed','survival','economic','boom','tiny','green','disaster','frontier','energy','endless','campaign:0'];
  const sig = g => { const S = g.S; return {ukuran:S.map.w + 'x' + S.map.h, awal:JSON.stringify(S.res), aturan:JSON.stringify(S.rules), tujuan:g.mode.goals(S).map(x => x.label).join('|'),
    petak:S.map.tiles.flat().some(t => t.hidden || t.damaged) || !!S.natural, batas:g.mode.days || g.mode.limit || 0}; };
  const sb = sig(base);
  ids.forEach(id => { const s = sig(game(id)); const d = Object.keys(sb).filter(k => String(sb[k]) !== String(s[k])).length; R.ok(d >= 3, id + ' berbeda dari Classic pada ' + d + ' unsur'); });
}
R.section('Aturan: peta prosedural dan kejadian (uji acak dengan seed tetap)');
{
  let seed = 12345; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const orig = Math.random; Math.random = rnd;
  let bad = [];
  const ids = ['classic','speed','survival','economic','boom','tiny','green','disaster','frontier','energy','endless','campaign:0','campaign:2','campaign:4','campaign:5'];
  ids.forEach(id => { for(let run = 0; run < 3; run++){
    const g = game(id), {S, ctx, B} = g, tools = [...Object.keys(ctx.BUILDINGS), 'demolish', 'repair', 'explore'];
    for(let d = 0; d < 60; d++){
      for(let k = 0; k < 4; k++){
        const x = Math.floor(rnd()*S.map.w), y = Math.floor(rnd()*S.map.h), t = tools[Math.floor(rnd()*tools.length)];
        t === 'demolish' ? B.demolish(S, x, y) : t === 'repair' ? B.repair(S, x, y) : t === 'explore' ? B.explore(S, x, y) : B.place(S, x, y, t);
      }
      const rep = ctx.Sim.runDay(S), r = S.res;
      if(!Object.values(r).every(Number.isFinite)) bad.push(id + ' angka tidak valid hari ' + d);
      if(r.food < 0 || r.wood < 0 || r.stone < 0 || r.population < 0 || !Number.isInteger(r.population)) bad.push(id + ' stok/penduduk tidak valid hari ' + d);
      if(S.res.population > rep.cap) bad.push(id + ' penduduk > kapasitas hari ' + d);
      if(S.map.tiles.length !== S.map.h || S.map.tiles.some(row => row.length !== S.map.w)) bad.push(id + ' dimensi peta tidak konsisten');
      if(S.map.tiles.flat().some(t => t.type !== 'empty' && t.type !== 'tree' && t.type !== 'rock' && t.type !== 'swamp' && !ctx.BUILDINGS[t.type])) bad.push(id + ' jenis petak tidak dikenal');
      if(S.map.tiles.flat().some(t => t.hidden && ctx.BUILDINGS[t.type])) bad.push(id + ' bangunan di wilayah tertutup');
      if(ctx.Modes[S.modeId].evaluate(S)) break;
    }
  } });
  Math.random = orig;
  R.ok(bad.length === 0, 'tidak ada keadaan mustahil dalam ' + ids.length*3 + ' permainan acak' + (bad.length ? ': ' + bad.slice(0,3).join('; ') : ''));
  // Peta prosedural valid
  Math.random = rnd; let mapBad = 0;
  for(let i = 0; i < 200; i++){ const g = game('frontier'), S = g.S; const sites = S.map.tiles.flat().filter(t => t.site); if(sites.length !== 3 || sites.some(t => t.type !== 'empty')) mapBad++; }
  for(let i = 0; i < 100; i++){ const g = game('endless'), S = g.S; for(let k = 0; k < 6; k++) g.ctx.MapSystem.expand(S.map, 2, 2, 0.1, 0.05); if(S.map.tiles.length !== S.map.h || S.map.tiles.some(r => r.length !== S.map.w)) mapBad++; }
  Math.random = orig;
  R.ok(mapBad === 0, 'peta prosedural: lokasi khusus valid dan perluasan konsisten');
}
