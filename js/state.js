// State permainan tunggal. Tidak ada logika tampilan di sini.
window.State = {
  data: null,
  init(mode){
    const map = MapSystem.generate(mode.width, mode.height, mode.treeDensity, mode.rockDensity);
    if(mode.fertileSeeds) MapSystem.addFertile(map, mode.fertileSeeds);
    if(mode.fog) MapSystem.applyFog(map, mode.fog.open, mode.fog.sites);
    (mode.preset || []).forEach(p => { const t = map.tiles[p.y][p.x]; t.type = p.type; t.hidden = false; if(p.damaged) t.damaged = true; });
    this.data = this.fix({
      modeId: mode.id, day: 1,
      res: Object.assign({}, mode.startResources, {population: mode.startPopulation}),
      map, tool: 'house', rules: mode.rules || {},
      natural: mode.natural ? Object.assign({}, mode.natural) : null,
      mission: mode.mission || null, missionIndex: mode.missionIndex == null ? null : mode.missionIndex,
      stats: {peakPop: mode.startPopulation}
    });
  },
  // Melengkapi field yang hilang (data baru atau simpanan lama)
  fix(d){
    const def = {tool:'house', satisfaction:80, shortage:0, lastReport:null, foodStreak:0, debtStreak:0, profitStreak:0, greenStreak:0, energyStreak:0,
      env:60, drought:0, dayMod:{}, costMult:1, over:null, rules:{}, natural:null, history:[], spent:{}, newAch:[], mission:null, missionIndex:null};
    for(const k in def) if(d[k] === undefined) d[k] = def[k];
    d.stats = Object.assign({built:0, cleared:0, expeditions:0, tilesOpened:0, peakPop:d.res.population}, d.stats || {});
    return d;
  }
};
