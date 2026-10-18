// Penduduk: kapasitas rumah, makan, pertumbuhan, kepuasan.
window.Population = {
  BASE_CAPACITY: 5, // tenda awal
  capacity(list){ return this.BASE_CAPACITY + Economy.sumActive(list,'capacity','population'); },
  // Mengembalikan perubahan penduduk dan mengisi rep.notes
  update(S, list, rep){
    const res = S.res, pop = res.population, cap = this.capacity(list);
    rep.cons.food = pop;
    if(res.food >= pop){ res.food -= pop; S.shortage = 0; }
    else { res.food = 0; S.shortage++; rep.notes.push('Makanan habis! Warga kelaparan.'); }
    let d = 0;
    if(S.shortage >= 2){ d = -Math.min(1, pop); rep.notes.push('Seorang warga pergi karena kelaparan.'); }
    else if(pop > cap){ d = cap - pop; rep.notes.push('Rumah penuh: warga kehilangan tempat tinggal.'); }
    else if(S.shortage === 0 && pop < cap && res.food >= pop){ d = 1; }
    res.population = pop + d;
    const eff = Economy.sumActive(list,'effects','satisfaction');
    S.satisfaction = Math.max(0, Math.min(100, 70 + eff - S.shortage*15 - (res.coins < 0 ? 10 : 0)));
    rep.pop = d; rep.cap = cap;
  }
};
