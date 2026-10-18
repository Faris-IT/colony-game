// Ekonomi: produksi, konsumsi bahan, biaya harian, dan kapasitas gudang.
window.Economy = {
  BASE_STORAGE: 200,
  addTo(obj, k, v){ obj[k] = (obj[k]||0) + v; },
  // Menjalankan produksi untuk bangunan yang punya pekerja dan bahan. Mengubah b.status.
  produce(res, list, rep){
    list.forEach(b => {
      if(!b.staffed){ b.t.status = 'nostaff'; return; }
      const need = b.d.consumption;
      const miss = Object.keys(need).find(k => (res[k]||0) < need[k]);
      if(miss){ b.t.status = 'noinput'; b.t.missing = miss; return; }
      b.t.status = 'ok'; b.active = true;
      for(const k in need){ res[k] -= need[k]; this.addTo(rep.cons, k, need[k]); }
      for(const k in b.d.production){ res[k] += b.d.production[k]; this.addTo(rep.prod, k, b.d.production[k]); }
    });
  },
  payMaintenance(res, list, rep){
    list.forEach(b => { if(b.active){ res.coins -= b.d.maintenance; rep.maint += b.d.maintenance; } });
  },
  sumActive(list, group, key){ return list.reduce((s,b) => s + (b.active ? (b.d[group][key]||0) : 0), 0); },
  clampStorage(res, list){
    const cap = this.BASE_STORAGE + this.sumActive(list,'capacity','storage');
    ['food','wood','stone'].forEach(k => { if(res[k] > cap) res[k] = cap; });
    res.energy = Math.min(res.energy, this.sumActive(list,'capacity','energyStorage'));
    return cap;
  }
};
