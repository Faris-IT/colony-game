// Sistem bangunan: validasi, biaya, bangun, hapus, perbaiki, ekspedisi.
window.BuildingSystem = {
  canAfford(cost, res){ return Object.entries(cost).every(([k,v]) => (res[k]||0) >= v); },
  pay(cost, res){ for(const k in cost) res[k] -= cost[k]; },
  give(gain, res){ for(const k in gain) res[k] = (res[k]||0) + gain[k]; },
  refund(cost){ const o={}; for(const k in cost) o[k] = Math.floor(cost[k]*CONFIG.demolishRefund); return o; },
  // Biaya bangun dengan pengali (Endless: biaya naik seiring waktu)
  scaled(cost, m){
    m = m || (window.Game && Game.S.costMult) || 1; if(m === 1) return cost;
    const o = {}; for(const k in cost){ const v = Math.ceil(cost[k]*m); o[k] = (k === 'coins' || k === 'food') ? v : Math.min(v, 150); } return o;
  },
  track(state, cost){ for(const k in cost) state.spent[k] = (state.spent[k]||0) + cost[k]; },
  expeditionCost(state){ return {food:8, coins:20 + 5*state.stats.expeditions}; },
  costText(cost){ return Object.entries(cost).map(([k,v]) => Sprites.icon(k)+' '+v).join('&nbsp; ') || 'Gratis'; },
  place(state, x, y, id){
    const def = BUILDINGS[id], tile = MapSystem.get(state.map, x, y);
    if(!def || !tile) return {ok:false, msg:'Petak tidak valid.'};
    if(tile.hidden) return {ok:false, msg:'Wilayah ini belum dijelajahi.'};
    if(tile.type !== 'empty') return {ok:false, msg:'Petak sudah terisi. Hapus isinya dulu.'};
    const cost = this.scaled(def.cost, state.costMult);
    if(!this.canAfford(cost, state.res)) return {ok:false, msg:'Sumber daya tidak cukup untuk '+def.name+'.'};
    this.pay(cost, state.res); this.track(state, cost);
    tile.type = id; tile.status = null; tile.damaged = false; state.stats.built++;
    return {ok:true, msg:def.name+' dibangun.'};
  },
  demolish(state, x, y){
    const tile = MapSystem.get(state.map, x, y);
    if(!tile || tile.hidden) return {ok:false, msg:'Wilayah ini belum dijelajahi.'};
    if(tile.type === 'swamp') return {ok:false, msg:'Rawa tidak cocok untuk pembangunan dan tidak bisa dibersihkan.'};
    if(tile.type === 'empty') return {ok:false, msg:'Petak ini sudah kosong.'};
    if(tile.type === 'tree' || tile.type === 'rock'){
      this.give(CONFIG.clearReward[tile.type], state.res); state.stats.cleared++;
      tile.type = 'empty';
      return {ok:true, msg:'Petak dibersihkan.'};
    }
    const def = BUILDINGS[tile.type];
    this.give(this.refund(def.cost), state.res);
    tile.type = 'empty'; tile.damaged = false;
    return {ok:true, msg:def.name+' dihapus. Sebagian biaya kembali.'};
  },
  repair(state, x, y){
    const tile = MapSystem.get(state.map, x, y);
    if(!tile || !BUILDINGS[tile.type]) return {ok:false, msg:'Tidak ada bangunan di petak ini.'};
    if(!tile.damaged) return {ok:false, msg:'Bangunan ini tidak rusak.'};
    const def = BUILDINGS[tile.type], cost = this.refund(def.cost);
    if(!this.canAfford(cost, state.res)) return {ok:false, msg:'Biaya perbaikan kurang: ' + def.name + '.'};
    this.pay(cost, state.res); this.track(state, cost); tile.damaged = false; tile.status = null;
    return {ok:true, msg:def.name+' diperbaiki.'};
  },
  explore(state, x, y){
    const tile = MapSystem.get(state.map, x, y), m = state.map;
    if(!tile || !tile.hidden) return {ok:false, msg:'Pilih petak gelap yang belum dijelajahi.'};
    const near = [-1,0,1].some(dy => [-1,0,1].some(dx => { const n = MapSystem.get(m, x+dx, y+dy); return n && !n.hidden; }));
    if(!near) return {ok:false, msg:'Ekspedisi harus dimulai dari petak yang bersebelahan dengan wilayah terbuka.'};
    const cost = this.expeditionCost(state);
    if(!this.canAfford(cost, state.res)) return {ok:false, msg:'Makanan atau Coins kurang untuk ekspedisi.'};
    this.pay(cost, state.res); this.track(state, cost); state.stats.expeditions++;
    const f = {tree:0, rock:0, fertile:0, swamp:0, site:0};
    for(let dy=-1; dy<=1; dy++) for(let dx=-1; dx<=1; dx++){
      const t = MapSystem.get(m, x+dx, y+dy); if(!t || !t.hidden) continue;
      t.hidden = false; state.stats.tilesOpened = (state.stats.tilesOpened||0) + 1;
      if(t.site) f.site++; else if(t.type === 'tree') f.tree++; else if(t.type === 'rock') f.rock++;
      else if(t.type === 'swamp') f.swamp++; else if(t.fertile) f.fertile++;
    }
    const parts = [];
    if(f.site) parts.push(f.site + ' lokasi sumber daya khusus!');
    if(f.fertile) parts.push(f.fertile + ' lahan subur');
    if(f.tree) parts.push(f.tree + ' pohon'); if(f.rock) parts.push(f.rock + ' batu');
    if(f.swamp) parts.push(f.swamp + ' rawa (tidak cocok dibangun)');
    return {ok:true, msg:'Ekspedisi menemukan: ' + (parts.join(', ') || 'tanah biasa') + '.'};
  }
};
