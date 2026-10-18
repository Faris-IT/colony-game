// Sistem bangunan: validasi, biaya, bangun, hapus.
window.BuildingSystem = {
  canAfford(cost, res){ return Object.entries(cost).every(([k,v]) => (res[k]||0) >= v); },
  pay(cost, res){ for(const k in cost) res[k] -= cost[k]; },
  give(gain, res){ for(const k in gain) res[k] = (res[k]||0) + gain[k]; },
  refund(cost){ const o={}; for(const k in cost) o[k] = Math.floor(cost[k]*CONFIG.demolishRefund); return o; },
  costText(cost){
    const icons = Object.fromEntries(CONFIG.RESOURCES.map(r=>[r.key,r.icon]));
    return Object.entries(cost).map(([k,v]) => icons[k]+' '+v).join('  ') || 'Gratis';
  },
  place(state, x, y, id){
    const def = BUILDINGS[id], tile = MapSystem.get(state.map, x, y);
    if(!def || !tile) return {ok:false, msg:'Petak tidak valid.'};
    if(tile.type !== 'empty') return {ok:false, msg:'Petak sudah terisi. Hapus isinya dulu.'};
    if(!this.canAfford(def.cost, state.res)) return {ok:false, msg:'Sumber daya tidak cukup untuk '+def.name+'.'};
    this.pay(def.cost, state.res);
    tile.type = id; state.stats.built++;
    return {ok:true, msg:def.name+' dibangun.'};
  },
  demolish(state, x, y){
    const tile = MapSystem.get(state.map, x, y);
    if(!tile || tile.type === 'empty') return {ok:false, msg:'Petak ini sudah kosong.'};
    if(tile.type === 'tree' || tile.type === 'rock'){
      this.give(CONFIG.clearReward[tile.type], state.res); state.stats.cleared++;
      tile.type = 'empty';
      return {ok:true, msg:'Petak dibersihkan.'};
    }
    const def = BUILDINGS[tile.type];
    this.give(this.refund(def.cost), state.res);
    tile.type = 'empty';
    return {ok:true, msg:def.name+' dihapus. Sebagian biaya kembali.'};
  }
};
