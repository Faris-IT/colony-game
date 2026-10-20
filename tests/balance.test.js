// Keseimbangan: bot sederhana harus bisa menang tiap mode dalam batas hari, dan pemain pasif tidak boleh menang.
const {game, play, seed, restore} = require('./harness'), R = require('./report');
const SEEDS = [1, 2, 3, 4, 5];
const base = (g, r) => { const p = g.S.res.population; if(g.cnt('farm')*6 < p + 4) g.b('farm', r); if(5 + 4*g.cnt('house') - p <= 2) g.b('house', r); };
const idle = () => {};
const repairAll = g => g.S.map.tiles.forEach((row, y) => row.forEach((t, x) => { if(t.damaged) g.B.repair(g.S, x, y); }));
const energyPol = (g, d) => { base(g, 40); if(d === 2) g.b('battery', 40); let cap = 0, dem = 0; g.all().forEach(t => { const x = g.ctx.BUILDINGS[t.type]; if(x){ cap += x.production.energy || 0; dem += x.consumption.energy || 0; } }); if(cap < dem + 3) g.b('power', 40); };
const parks = n => (g) => { base(g, 40); if(g.cnt('park') < Math.ceil(g.S.res.population/10) + n) g.b('park', 40); };
const bots = [
  {name:'Classic', hash:'classic', max:60, day:40, pol:(g,d) => { base(g, 20); if(!g.cnt('sawmill')) g.b('sawmill', 20); }},
  {name:'Tutorial', hash:'tutorial', max:40, day:30, pol:(g,d) => {
     if(d === 1){ let n = 0; g.S.map.tiles.forEach((r,y) => r.forEach((t,x) => { if(n < 2 && (t.type === 'tree' || t.type === 'rock')){ g.B.demolish(g.S, x, y); n++; } })); g.q = ['house','farm','sawmill']; }
     if(d === 2) g.q.push('road','house','power','market','park','house','farm');
     while(g.q.length){ const t = g.q[0]; let ok;
       if(t === 'road'){ let done = false; g.S.map.tiles.forEach((r,y) => r.forEach((c,x) => { if(!done && c.type === 'empty' && g.ctx.Sim.nearRoad(g.S.map,x,y) === false && [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => { const n = g.ctx.MapSystem.get(g.S.map,x+dx,y+dy); return n && g.ctx.BUILDINGS[n.type] && n.type !== 'road'; })) done = g.B.place(g.S,x,y,'road').ok; })); ok = done; }
       else ok = g.b(t); if(ok) g.q.shift(); else break; } }},
  {name:'Speed Builder', hash:'speed', max:35, day:30, pol:(g,d) => { base(g,30); const p = g.S.res.population; const free = n => g.jobs() + n <= p; if(!g.cnt('sawmill') && free(2)) g.b('sawmill',30); if(g.cnt('park') < Math.ceil(p/10)) g.b('park',30); if(d > 2 && !g.cnt('power') && free(2)) g.b('power',30); if(g.cnt('power') && g.cnt('market') < 3 && free(2)) g.b('market',30); if(d > 4 && !g.cnt('quarry') && free(3)) g.b('quarry',30); if(g.cnt('orchard') < 2 && d > 3 && free(2)) g.b('orchard',30); }},
  {name:'Survival', hash:'survival', max:70, day:60, pol:(g) => { base(g,20); if(g.S.res.wood < 30 && g.cnt('sawmill') < 1) g.b('sawmill',20); }},
  {name:'Economic Empire', hash:'economic', max:150, day:120, pol:(g,d) => { base(g,40); const c = ['sawmill','quarry','farm','orchard']; if(g.jobs() + 3 <= g.S.res.population) g.b(c[d%4],60); }},
  {name:'Population Boom', hash:'boom', max:120, day:90, pol:(g,d) => { const p = g.S.res.population; if(g.cnt('farm')*6 < p+8) g.b('farm'); if(5+4*g.cnt('house')-p <= 8) g.b('house'); if(g.cnt('park') < Math.ceil(p/10)) g.b('park'); if(g.jobs()+3 <= p) g.b(d%2 ? 'sawmill' : 'orchard'); }},
  {name:'Tiny Territory', hash:'tiny', max:80, day:70, pol:(g,d) => { if(d === 1){ for(let x = 1; x <= 6; x++) g.at(x,3,'road'); g.q = [[1,2,'house'],[2,2,'farm'],[3,2,'house'],[4,2,'farm'],[1,4,'house'],[3,4,'sawmill'],[5,2,'park'],[6,2,'house'],[2,4,'farm'],[4,4,'house'],[5,4,'farm'],[6,4,'farm']]; } while(g.q.length && g.at(...g.q[0])) g.q.shift(); }},
  {name:'Green Colony', hash:'green', max:80, day:50, pol:parks(9)},
  {name:'Disaster Response', hash:'disaster', max:40, day:30, pol:(g) => { if(g.S.res.stone < 20 && !g.cnt('quarry')) g.b('quarry',60); if(g.S.res.wood < 20 && g.cnt('sawmill') < 2) g.b('sawmill',60); const p = g.S.res.population; if(g.cnt('farm')*6 < p+2) g.b('farm',40); repairAll(g); }},
  {name:'Frontier Explorer', hash:'frontier', max:80, day:60, pol:(g) => { base(g,40); if(g.S.res.wood < 30 && !g.cnt('sawmill')) g.b('sawmill',40); if(!g.q) g.q = [[5,3],[3,2],[1,1],[12,3],[14,2],[16,2],[9,8],[9,10]]; if(g.q.length && g.S.res.coins >= 70 && g.B.explore(g.S, ...g.q[0]).ok) g.q.shift(); [[1,1],[16,2],[9,10]].forEach(([x,y]) => { if(!g.S.map.tiles[y][x].hidden) g.at(x,y,'farm'); }); }},
  {name:'Energy Crisis', hash:'energy', max:60, day:40, pol:energyPol},
  {name:'Campaign 1 Fondasi', hash:'campaign:0', max:35, day:30, pol:(g) => base(g,30)},
  {name:'Campaign 2 Roda Ekonomi', hash:'campaign:1', max:40, day:35, pol:(g,d) => { base(g,40); const c = ['sawmill','quarry','farm','orchard']; if(g.jobs() + 3 <= g.S.res.population) g.b(c[d%4],60); }},
  {name:'Campaign 3 Tenaga Listrik', hash:'campaign:2', max:40, day:35, pol:energyPol},
  {name:'Campaign 4 Hijau Kembali', hash:'campaign:3', max:50, day:45, pol:parks(9)},
  {name:'Campaign 5 Terra Incognita', hash:'campaign:4', max:50, day:45, pol:(g) => { base(g,40); if(g.S.res.wood < 30 && !g.cnt('sawmill')) g.b('sawmill',40); if(!g.q) g.q = [[3,2],[1,1],[8,7],[10,8]]; if(g.q.length && g.S.res.coins >= 70 && g.B.explore(g.S, ...g.q[0]).ok) g.q.shift(); [[1,1],[10,8]].forEach(([x,y]) => { if(!g.S.map.tiles[y][x].hidden) g.at(x,y,'farm'); }); }},
  {name:'Campaign 6 Pasca Badai', hash:'campaign:5', max:30, day:25, pol:(g) => { if(g.S.res.stone < 20 && !g.cnt('quarry')) g.b('quarry',60); if(g.S.res.wood < 20 && g.cnt('sawmill') < 2) g.b('sawmill',60); const p = g.S.res.population; if(g.cnt('farm')*6 < p+2) g.b('farm',40); repairAll(g); }}
];
R.section('Keseimbangan: bot harus menang di minimal 4 dari 5 peta acak');
bots.forEach(b => {
  const res = SEEDS.map(sd => { seed(sd); const g = game(b.hash); const r = play(g, b.pol, b.max); return {...r, pop:g.S.res.population}; }); restore();
  const wins = res.filter(r => r.result === 'win' && r.day <= b.day), days = res.filter(r => r.result === 'win').map(r => r.day);
  R.ok(wins.length >= 4, b.name + ': menang ' + wins.length + '/5 (hari ' + (days.join(', ') || '-') + '; batas ' + b.day + ')');
});
{ const res = SEEDS.map(sd => { seed(sd); const g = game('endless'); const r = play(g, (g) => { const p = g.S.res.population; if(g.cnt('farm')*4 < p+4) g.b('farm',40); if(5+4*g.cnt('house')-p <= 2) g.b('house',40); if(g.cnt('park') < Math.ceil(p/10)) g.b('park',40); if(!g.cnt('sawmill')) g.b('sawmill',40); }, 150); return r.result === 'none'; }); restore();
  R.ok(res.filter(Boolean).length >= 4, 'Endless Settlement: bot bertahan 150 hari di ' + res.filter(Boolean).length + '/5 peta'); }
R.section('Keseimbangan: pemain pasif tidak boleh menang');
['classic','speed','survival','economic','boom','tiny','green','disaster','frontier','energy','endless'].forEach(h => {
  const res = SEEDS.map(sd => { seed(sd); return play(game(h), idle, 120).result; }); restore();
  R.ok(!res.includes('win'), h + ' pasif tidak pernah menang (' + res.join(', ') + ')');
});
