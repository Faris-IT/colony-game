// Titik masuk Tahap 1: peta + pembangunan. Simulasi hari dimulai di Tahap 3.
(function(){
  State.init(CONFIG.mode);
  const S = State.data, hover = {x:null, y:null};
  const keys = ['road','house','farm','sawmill','quarry','warehouse','park','market','demolish'];

  function refresh(){
    UI.renderResources(S);
    UI.renderTools(S.tool, S.res);
    UI.renderInfo(S.tool, hover.x==null ? null : MapSystem.get(S.map, hover.x, hover.y));
  }
  function act(x, y){
    const r = S.tool === 'demolish' ? BuildingSystem.demolish(S, x, y) : BuildingSystem.place(S, x, y, S.tool);
    UI.toast(r.msg, !r.ok);
    if(r.ok){ Renderer.drawTile(S.map, x, y); Renderer.pulse(S.map, x, y); }
    refresh();
  }
  function pos(e){ const c = e.target.closest('.cell'); return c ? {x:+c.dataset.x, y:+c.dataset.y} : null; }

  window.Game = {S, refresh};
  Renderer.build(S.map);
  refresh();

  const mapEl = document.getElementById('map');
  mapEl.addEventListener('click', e => { const p = pos(e); if(p){ hover.x=p.x; hover.y=p.y; Renderer.setCursor(S.map,p.x,p.y); act(p.x,p.y); } });
  mapEl.addEventListener('mouseover', e => { const p = pos(e); if(p){ hover.x=p.x; hover.y=p.y; UI.renderInfo(S.tool, MapSystem.get(S.map,p.x,p.y)); } });
  document.getElementById('tools').addEventListener('click', e => {
    const b = e.target.closest('.tool'); if(!b) return;
    S.tool = b.dataset.tool; refresh();
  });
  // Keyboard: panah gerak, Enter/Spasi bangun, Delete hapus, 1-9 pilih alat
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
