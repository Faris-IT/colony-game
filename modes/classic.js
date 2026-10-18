// Mode Colony Classic: tujuan, kondisi menang, dan kondisi kalah.
window.Modes = window.Modes || {};
Modes.classic = {
  id:'classic', name:'Colony Classic',
  targetPop:30, foodDays:5, debtDays:5,
  intro:'Bangun koloni yang stabil.',
  goals(S){
    return [
      {label:'Penduduk', cur:S.res.population, target:this.targetPop, ok:S.res.population >= this.targetPop},
      {label:'Saldo Coins positif', text:S.res.coins > 0 ? 'Ya' : 'Belum', ok:S.res.coins > 0},
      {label:'Makanan aman (hari berturut-turut)', cur:S.foodStreak, target:this.foodDays, ok:S.foodStreak >= this.foodDays}
    ];
  },
  // Dipanggil setiap akhir hari. Mengembalikan {result, reason} atau null.
  evaluate(S){
    if(S.res.population <= 0) return {result:'lose', reason:'Seluruh penduduk telah pergi.'};
    if(S.debtStreak >= this.debtDays) return {result:'lose', reason:'Koloni bangkrut selama '+this.debtDays+' hari berturut-turut.'};
    if(this.goals(S).every(g => g.ok)) return {result:'win', reason:'Koloni stabil: penduduk cukup, kas positif, dan makanan aman.'};
    return null;
  }
};
