// Penyimpanan lokal (localStorage) dengan cadangan memori bila tidak tersedia. Data rusak ditangani dengan aman.
window.Store = (function(){
  const KP = 'mufa-colony-progress', KG = 'mufa-colony-save', KM = 'mufa-colony-meta', mem = {};
  const get = k => { try { return localStorage.getItem(k); } catch(e) { return mem[k] || null; } };
  const set = (k,v) => { try { localStorage.setItem(k, v); } catch(e) { mem[k] = v; } };
  const del = k => { try { localStorage.removeItem(k); } catch(e) {} delete mem[k]; };
  const defaults = () => ({v:1, ach:{}, campaign:{done:[]}, records:{}, last:null,
    stats:{daysPlayed:0, built:0, peakPop:0, bestProfit:0, totalScore:0, wins:0, losses:0, types:[]},
    settings:{lite:false, cell:'auto', popup:true}});
  function load(){
    const d = defaults();
    try {
      const p = JSON.parse(get(KP) || 'null');
      if(p && typeof p === 'object'){
        d.stats = Object.assign(d.stats, p.stats || {}); d.settings = Object.assign(d.settings, p.settings || {});
        if(p.campaign && Array.isArray(p.campaign.done)) d.campaign.done = p.campaign.done;
        if(!Array.isArray(d.stats.types)) d.stats.types = [];
        if(p.ach && typeof p.ach === 'object') d.ach = p.ach;
        if(p.records && typeof p.records === 'object') d.records = p.records;
        if(typeof p.last === 'string') d.last = p.last;
      }
    } catch(e) { /* data rusak: mulai dari awal */ }
    return d;
  }
  const api = {
    data: load(),
    save(){ set(KP, JSON.stringify(this.data)); },
    reset(){ this.data = defaults(); del(KP); del(KG); del(KM); },
    saveGame(S){
      const name = S.modeId === 'campaign' ? 'Campaign: ' + S.mission.name : Modes[S.modeId].name;
      set(KG, JSON.stringify(S)); set(KM, JSON.stringify({name, day:S.day}));
    },
    clearGame(){ del(KG); del(KM); },
    hasGame(){ return !!get(KG) && !!get(KM); },
    gameLabel(){ try { const m = JSON.parse(get(KM)); return m.name + ', hari ' + m.day; } catch(e) { return ''; } },
    loadGame(){
      try {
        const d = JSON.parse(get(KG) || 'null');
        const ok = d && d.res && d.map && Array.isArray(d.map.tiles) && d.map.tiles.length === d.map.h && typeof d.day === 'number'
          && Modes[d.modeId] && Object.values(d.res).every(v => Number.isFinite(v));
        if(!ok) throw new Error('rusak');
        return State.fix(d);
      } catch(e) { this.clearGame(); return null; }
    },
    trackBuild(type){ const s = this.data.stats; s.built++; if(!s.types.includes(type)) s.types.push(type); },
    trackDay(S, rep){ const s = this.data.stats; s.daysPlayed++; s.peakPop = Math.max(s.peakPop, S.res.population); s.bestProfit = Math.max(s.bestProfit, rep.delta.coins); this.save(); },
    trackEnd(S, ev, score){
      const s = this.data.stats, tut = S.modeId === 'tutorial', key = S.modeId;
      const r = this.data.records[key] = this.data.records[key] || {plays:0, wins:0, bestScore:0, bestDays:0};
      r.plays++; if(ev.result === 'win') { r.wins++; s.wins++; } else if(ev.result === 'lose') s.losses++;
      const rec = score > r.bestScore; r.bestScore = Math.max(r.bestScore, score); r.bestDays = Math.max(r.bestDays, S.day - 1);
      if(!tut) s.totalScore += score;
      this.save(); return rec;
    },
    completeMission(id){ const d = this.data.campaign.done; if(!d.includes(id)) d.push(id); this.save(); }
  };
  return api;
})();
window.Settings = {
  apply(){
    const s = Store.data.settings;
    document.body.classList.toggle('lite', !!s.lite);
    const px = {small:'30px', large:'56px'}[s.cell];
    if(px) document.documentElement.style.setProperty('--cell', px); else document.documentElement.style.removeProperty('--cell');
  }
};
