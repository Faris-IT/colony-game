// State permainan tunggal. Tidak ada logika tampilan di sini.
window.State = {
  data: null,
  init(mode){
    const map = MapSystem.generate(mode.width, mode.height, mode.treeDensity, mode.rockDensity);
    (mode.preset || []).forEach(p => { map.tiles[p.y][p.x].type = p.type; });
    this.data = {
      modeId: mode.id, day: 1,
      res: Object.assign({}, mode.startResources, {population: mode.startPopulation}),
      map, tool: 'house', satisfaction: 80, shortage: 0, lastReport: null,
      foodStreak: 0, debtStreak: 0, profitStreak: 0, over: null,
      rules: mode.rules || {},                                   // aturan ekonomi khusus mode
      natural: mode.natural ? Object.assign({}, mode.natural) : null, // cadangan alam terbatas
      stats: {built: 0, cleared: 0, peakPop: mode.startPopulation}
    };
  }
};
