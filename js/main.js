// Titik masuk: memilih mode dari hash (#classic, #campaign:2, #continue), peta, pembangunan, petunjuk tutorial.
(function(){
  Settings.apply();
  const H = (location.hash || '').slice(1), [HID, HARG] = H.split(':');
  const loaded = HID === 'continue' ? Store.loadGame() : null;
  if(loaded) State.data = loaded;
  else State.init(HID === 'campaign' ? Campaign.config(HARG) : (CONFIG.modes[HID] || CONFIG.mode));
  const S = State.data, hover = {x:null, y:null};
  const chosen = !!loaded || HID === 'campaign' || !!CONFIG.modes[HID];
  if(chosen) { Store.data.last = S.modeId === 'campaign' ? 'campaign:' + S.missionIndex : S.modeId; Store.save(); }
  const keys = ['road','house','farm','sawmill','quarry','warehouse','park','market','demolish'];

  // Petak yang ditunjuk panah tutorial
  function suggest(t){
    const cx = S.map.w >> 1, cy = S.map.h >> 1; let best = null, bd = 1e9;
    S.map.tiles.forEach((row,y) => row.forEach((c,x) => {
      if(c.hidden) return;
      let ok;
      if(t === 'demolish') ok = c.type === 'tree' || c.type === 'rock';
      else if(t === 'repair') ok = !!c.damaged;
      else if(t === 'explore') ok = false;
      else if(t === 'road') ok = c.type === 'empty' && [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => { const n = MapSystem.get(S.map, x+dx, y+dy); return n && BUILDINGS[n.type] && n.type !== 'road'; });
      else ok = c.type === 'empty' && !c.site;
      if(!ok) return;
      const d = (x-cx)**2 + (y-cy)**2; if(d < bd){ bd = d; best = {x, y}; }
    }));
    return best;
  }
  function refresh(){
    const M = Modes[S.modeId];
    window.HINT = M.hint ? M.hint(S) : null;
    UI.renderResources(S); UI.renderTools(S.tool, S.res); UI.renderGoals(M.goals(S));
    UI.renderInfo(S.tool, hover.x == null ? null : MapSystem.get(S.map, hover.x, hover.y));
    Renderer.clearHint();
    if(HINT && S.tool === HINT && !S.over){ const p = suggest(HINT); if(p) Renderer.hintTile(S.map, p.x, p.y); }
    document.getElementById('nextDay').classList.toggle('hint', HINT === 'nextDay');
    const hb = document.querySelector('.tool.hint'); if(hb && hb.scrollIntoView) hb.scrollIntoView({block:'nearest'});
    if(S.over) Store.clearGame(); else Store.saveGame(S);
  }
  function act(x, y){
    if(S.over){ UI.toast('Permainan sudah selesai. Buka Menu untuk mengulang.', true); return; }
    const T = S.tool;
    const r = T === 'demolish' ? BuildingSystem.demolish(S, x, y) : T === 'repair' ? BuildingSystem.repair(S, x, y)
      : T === 'explore' ? BuildingSystem.explore(S, x, y) : BuildingSystem.place(S, x, y, T);
    UI.toast(r.msg, !r.ok);
    if(r.ok){
      if(T === 'explore') Renderer.drawAll(S.map); else Renderer.drawNear(S.map, x, y);
      Renderer.pulse(S.map, x, y);
      if(BUILDINGS[T]) Store.trackBuild(T);
      Achievements.check(S, {phase:'build'});
    }
    refresh();
  }
  function pos(e){ const c = e.target.closest('.cell'); return c ? {x:+c.dataset.x, y:+c.dataset.y} : null; }

  window.Game = {S, refresh, chosen, loaded: !!loaded};
  Renderer.build(S.map);
  refresh();

  const mapEl = document.getElementById('map');
  mapEl.addEventListener('click', e => { const p = pos(e); if(p){ hover.x=p.x; hover.y=p.y; Renderer.setCursor(S.map,p.x,p.y); act(p.x,p.y); } });
  mapEl.addEventListener('mouseover', e => { const p = pos(e); if(p){ hover.x=p.x; hover.y=p.y; UI.renderInfo(S.tool, MapSystem.get(S.map,p.x,p.y)); } });
  document.getElementById('tools').addEventListener('click', e => {
    const b = e.target.closest('.tool'); if(!b) return;
    S.tool = b.dataset.tool; refresh();
  });
  mapEl.addEventListener('keydown', e => {
    if(hover.x==null){ hover.x = S.map.w>>1; hover.y = S.map.h>>1; }
    const m = {ArrowLeft:[-1,0], ArrowRight:[1,0], ArrowUp:[0,-1], ArrowDown:[0,1]}[e.key];
    if(m){ e.preventDefault(); hover.x = Math.max(0,Math.min(S.map.w-1,hover.x+m[0])); hover.y = Math.max(0,Math.min(S.map.h-1,hover.y+m[1]));
           Renderer.setCursor(S.map,hover.x,hover.y); refresh(); }
    else if(e.key==='Enter' || e.key===' '){ e.preventDefault(); act(hover.x, hover.y); }
    else if(e.key==='Delete' || e.key==='Backspace'){ const t=S.tool; S.tool='demolish'; act(hover.x,hover.y); S.tool=t; refresh(); }
    else if(/^[1-9]$/.test(e.key)){ S.tool = keys[+e.key-1]; refresh(); }
  });
})();
