// Kualitas: semua mode dapat dimuat tanpa error JavaScript, penyimpanan dan data rusak ditangani aman.
const {boot} = require('./harness'), R = require('./report');
R.section('Smoke: semua mode, layar, dan penyimpanan');
const hashes = ['', 'tutorial','classic','speed','survival','economic','boom','tiny','green','disaster','frontier','energy','endless', ...[0,1,2,3,4,5].map(i => 'campaign:' + i)];
hashes.forEach(h => {
  try {
    const {ctx, els} = boot(h), S = ctx.Game.S;
    for(let i = 0; i < 3; i++) els.nextDay.onclick();
    ['food','wood','stone','coins','energy','population','satisfaction'].forEach(k => ctx.UI.statsModal(S, k));
    ['main','modes','campaign','ach','stats','settings'].forEach(n => ctx.Screens[n](true));
    R.ok(S.day >= 2, 'mode #' + (h || 'menu') + ' berjalan 3 hari tanpa error');
  } catch(e){ R.ok(false, 'mode #' + h + ': ' + e.message); }
});
const a = boot('classic'); a.els.nextDay.onclick(); a.els.nextDay.onclick();
const saved = Object.assign({}, a.store);
const b = boot('continue', st => Object.assign(st, saved));
R.ok(b.ctx.Game.loaded && b.ctx.Game.S.day === 3, 'Continue Game memulihkan permainan (hari 3)');
R.ok(!boot('continue', st => { st['mufa-colony-save'] = '{rusak'; st['mufa-colony-meta'] = '{}'; }).ctx.Game.loaded, 'simpanan rusak ditolak dengan aman');
R.ok(!boot('continue', st => { const o = JSON.parse(saved['mufa-colony-save']); o.res.food = null; st['mufa-colony-save'] = JSON.stringify(o); st['mufa-colony-meta'] = '{}'; }).ctx.Game.loaded, 'simpanan tidak lengkap ditolak');
const c = boot('', st => { st['mufa-colony-progress'] = 'bukan json'; });
R.ok(c.ctx.Store.data.stats.daysPlayed === 0, 'data progres rusak diganti data awal');
