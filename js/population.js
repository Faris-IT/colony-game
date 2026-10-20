// Penduduk: kapasitas rumah, makan, pertumbuhan, kepuasan.
window.Population = {
  BASE_CAPACITY: 5, // tenda awal
  capacity(list){ return this.BASE_CAPACITY + list.reduce((s,b) => s + (b.active ? (b.d.capacity.population||0) : (!b.t.damaged && b.connected ? (b.d.capacity.populationFallback||0) : 0)), 0); },
  social(list){ return list.filter(b => b.active && b.d.effects.satisfaction > 0).length; },
  update(S, list, rep){
    const res = S.res, pop = res.population, cap = this.capacity(list);
    rep.cons.food = pop;
    if(res.food >= pop){ res.food -= pop; S.shortage = 0; }
    else { res.food = 0; S.shortage++; rep.notes.push('Makanan habis! Warga kelaparan.'); }
    // Kepuasan: dasar 80, plus fasilitas aktif. Tiap 10 warga butuh 1 fasilitas sosial (selain yang pertama).
    const unemp = S.rules.unemployment ? Math.min(25, Math.floor((rep.unemployed||0)/4)*3) : 0;
    if(unemp) rep.notes.push("Banyak warga menganggur: bangun tempat kerja.");
    const greenPen = S.rules.green ? Math.max(0, Math.round((60 - S.env) / 2)) : 0;
    const need = Math.max(0, Math.ceil(pop/10) - 1), social = this.social(list);
    S.satisfaction = Math.max(0, Math.min(100, 80 + Economy.sumActive(list,'effects','satisfaction')
      - 8*Math.max(0, need - social) - unemp - greenPen - S.shortage*15 - (res.coins < 0 ? 10 : 0)));
    if(need > social) rep.notes.push('Warga butuh fasilitas: taman, klinik, sekolah, atau pasar.');
    let d = 0;
    if(S.shortage >= 2){ d = -Math.min(1, pop); rep.notes.push('Seorang warga pergi karena kelaparan.'); }
    else if(pop > cap){ d = cap - pop; rep.notes.push('Rumah penuh: warga kehilangan tempat tinggal.'); }
    else if(S.satisfaction < 30 && pop > 0){ d = -1; rep.notes.push('Warga tidak puas dan pergi.'); }
    else if(S.shortage === 0 && S.satisfaction >= 50 && pop < cap && res.food >= pop){ d = Math.min((S.rules.growth||1) + (S.satisfaction >= 85 ? 1 : 0), cap - pop); }
    res.population = pop + d; rep.pop = d; rep.cap = cap; rep.sat = S.satisfaction;
  }
};
