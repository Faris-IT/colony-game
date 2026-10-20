// Memuat game persis seperti di browser (urutan <script> dari index.html) dalam DOM palsu, tanpa dependensi.
const vm = require('vm'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
function boot(hash, pre){
  const els = {}, store = {};
  const mk = () => { const e = {children:[], style:{setProperty(){}, removeProperty(){}}, dataset:{}, handlers:{}, _cls:new Set(), innerHTML:'', textContent:'', hidden:false, className:'', value:'', checked:false, title:'',
    classList:{add(...a){a.forEach(x => e._cls.add(x));}, remove(...a){a.forEach(x => e._cls.delete(x));}, contains:x => e._cls.has(x), toggle(x,f){ f ? e._cls.add(x) : e._cls.delete(x); }},
    setAttribute(){}, removeAttribute(){}, addEventListener(t,f){ e.handlers[t] = f; }, appendChild(c){ e.children.push(c); }, querySelector:() => mk(), querySelectorAll:() => [], closest:() => null, focus(){}, scrollIntoView(){}, offsetWidth:0}; return e; };
  const ctx = {console, Math, JSON, Object, Array, Number, Date, Set, Promise, setInterval:() => 0, clearInterval(){}, clearTimeout(){}, setTimeout:() => 0,
    document:{getElementById:id => els[id] = els[id] || mk(), body:mk(), documentElement:mk(), createElement:() => mk(), addEventListener(){}, querySelector:() => null, querySelectorAll:() => []},
    localStorage:{getItem:k => k in store ? store[k] : null, setItem:(k,v) => { store[k] = String(v); }, removeItem:k => { delete store[k]; }},
    location:{hash: hash ? '#' + hash : '', reload(){}}, confirm:() => true};
  ctx.window = ctx; vm.createContext(ctx); if(pre) pre(store);
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  [...html.matchAll(/<script src="([^"]+)"/g)].forEach(m => vm.runInContext(fs.readFileSync(path.join(ROOT, m[1]), 'utf8'), ctx, {filename:m[1]}));
  return {ctx, els, store};
}
// Pembungkus permainan untuk bot dan uji aturan
function game(hash){
  const {ctx, els, store} = boot(hash), S = ctx.State.data, B = ctx.BuildingSystem;
  const all = () => S.map.tiles.flat(), cnt = t => all().filter(x => x.type === t).length;
  const spot = () => { for(let y=0;y<S.map.h;y++) for(let x=0;x<S.map.w;x++){ const t = S.map.tiles[y][x]; if(t.type === 'empty' && !t.hidden && !t.site) return [x,y]; } };
  const b = (t, r = 0) => { if(S.res.coins - (B.scaled(ctx.BUILDINGS[t].cost, S.costMult).coins || 0) < r) return false; const p = spot(); return !!p && B.place(S, p[0], p[1], t).ok; };
  const at = (x, y, t) => { const k = S.map.tiles[y][x]; if(k.type === t) return true; if(k.type === 'tree' || k.type === 'rock') B.demolish(S, x, y); return B.place(S, x, y, t).ok; };
  const jobs = () => all().reduce((s,t) => s + (ctx.BUILDINGS[t.type] ? ctx.BUILDINGS[t.type].workersRequired : 0), 0);
  return {ctx, els, store, S, B, all, cnt, b, at, jobs, mode: ctx.Modes[S.modeId]};
}
// Menjalankan kebijakan (bot) hari demi hari sampai mode memberi hasil
function play(g, policy, max){
  for(let d = 1; d <= max; d++){
    policy(g, d); g.ctx.Sim.runDay(g.S);
    const ev = g.mode.evaluate(g.S); if(ev) return {day:d, result:ev.result, reason:ev.reason};
  }
  return {day:max, result:'none', reason:'belum selesai'};
}
// Pengacak berseed supaya hasil uji dapat diulang
function seed(n){ let s = n | 0; Math.random = () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const realRandom = Math.random;
module.exports = {boot, game, play, seed, restore:() => { Math.random = realRandom; }, ROOT};
