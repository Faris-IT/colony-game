// Skor akhir. Tiap mode punya bobot berbeda (Green menekankan lingkungan, Economic menekankan laba).
window.Scoring = {
  W:{def:{pop:10, active:5, prod:2, sat:2, days:5, coins:0.05, env:0, land:0},
     economic:{pop:5, active:5, prod:2, sat:1, days:2, coins:0.2},
     green:{pop:6, active:3, prod:1, sat:3, days:5, coins:0.02, env:5},
     tiny:{pop:10, active:6, prod:2, sat:2, days:3, land:1.5}},
  calc(S){
    const w = Object.assign({}, this.W.def, this.W[S.modeId] || {}), r = S.lastReport || {};
    const tiles = S.map.w * S.map.h, used = S.map.tiles.flat().filter(t => BUILDINGS[t.type]).length;
    return Math.round(S.res.population*w.pop + (r.active||0)*w.active + (r.prodTotal||0)*w.prod + S.satisfaction*w.sat
      + (S.day-1)*w.days + Math.max(0, S.res.coins)*w.coins + S.env*w.env + used/tiles*100*w.land);
  },
  final(S){ const M = Modes[S.modeId]; return M && M.score ? M.score(S) : this.calc(S); }
};
