// State permainan tunggal. Tidak ada logika tampilan di sini.
window.State = {
  data: null,
  init(mode){
    this.data = {
      modeId: mode.id, day: 1,
      res: Object.assign({}, mode.startResources, {population: mode.startPopulation}),
      map: MapSystem.generate(mode.width, mode.height, mode.treeDensity, mode.rockDensity),
      tool: 'house', satisfaction: 70, shortage: 0, lastReport: null, foodStreak: 0, debtStreak: 0, over: null, stats: {built: 0, peakPop: mode.startPopulation}
    };
  }
};
