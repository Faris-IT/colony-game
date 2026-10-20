// Ekonomi: produksi, bahan, cadangan alam, penjualan stok, biaya harian, kapasitas gudang.
window.Economy = {
  BASE_STORAGE: 200,
  PRICES: {food:2, wood:3, stone:4},
  addTo(obj, k, v){ obj[k] = (obj[k]||0) + v; },
  produce(S, list, rep){
    const res = S.res, mod = S.dayMod || {};
    rep.energyShort = 0;
    list.forEach(b => {
      const t = b.t;
      if(t.damaged){ t.status = 'damaged'; return; }
      if(!b.connected){ t.status = 'noroad'; return; }
      if(!b.staffed){ t.status = 'nostaff'; return; }
      const need = b.d.consumption, miss = Object.keys(need).find(k => (res[k]||0) < need[k]);
      if(miss){ t.status = 'noinput'; t.missing = miss; if(miss === 'energy') rep.energyShort++; return; }
      const lim = S.natural ? (b.d.production.wood ? 'wood' : b.d.production.stone ? 'stone' : null) : null;
      if(lim && S.natural[lim] <= 0){ t.status = 'noinput'; t.missing = 'natural'; return; }
      t.status = 'ok'; b.active = true;
      for(const k in need){ res[k] -= need[k]; this.addTo(rep.cons, k, need[k]); }
      const farm = b.d.production.food > 0;
      const mult = (t.site ? 2 : 1) * (b.near ? 1.2 : 1) * (farm ? (t.fertile ? 1.5 : (S.rules.fertileOnly ? 0.6 : 1)) : 1);
      for(const k in b.d.production){
        let v = b.d.production[k] * mult;
        if(k === 'energy' && mod.power != null) v *= mod.power;
        if(k === 'food' && mod.food != null) v *= mod.food;
        v = Math.round(v);
        if(lim === k){ v = Math.min(v, S.natural[k]); S.natural[k] -= v; }
        res[k] += v; this.addTo(rep.prod, k, v);
      }
    });
  },
  sell(S, rep){
    const keep = {food: S.res.population*4 + 10, wood: 40, stone: 40};
    for(const k in this.PRICES){
      const q = Math.floor(S.res[k] - keep[k]); if(q <= 0) continue;
      const c = Math.round(q * this.PRICES[k] * Math.max(0.5, 1 - q/400));
      S.res[k] -= q; S.res.coins += c; rep.sales += c; rep.sold[k] = q;
    }
  },
  payMaintenance(res, list, rep, mult){
    list.forEach(b => { if(b.active){ const c = Math.round(b.d.maintenance * mult); res.coins -= c; rep.maint += c; } });
  },
  sumActive(list, group, key){ return list.reduce((s,b) => s + (b.active ? (b.d[group][key]||0) : 0), 0); },
  clampStorage(res, list){
    const cap = this.BASE_STORAGE + this.sumActive(list,'capacity','storage');
    ['food','wood','stone'].forEach(k => { if(res[k] > cap) res[k] = cap; });
    res.energy = Math.min(res.energy, this.sumActive(list,'capacity','energyStorage'));
    return cap;
  }
};
