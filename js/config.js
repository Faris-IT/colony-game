window.CONFIG = {
  // Mode Classic (Tahap 1): peta 16x12, sumber daya awal, penduduk awal
  mode: {id:'classic', name:'Colony Classic', width:16, height:12,
         startResources:{food:40, wood:60, stone:20, coins:200, energy:0}, startPopulation:5,
         treeDensity:0.12, rockDensity:0.06},
  demolishRefund: 0.5,
  taxPerCitizen: 1,      // pajak: Coins per warga per hari
  clearReward:{tree:{wood:3}, rock:{stone:3}},
  RESOURCES:[
    {key:'food',  icon:'🌾', label:'Makanan'},
    {key:'wood',  icon:'🪵', label:'Kayu'},
    {key:'stone', icon:'🪨', label:'Batu'},
    {key:'coins', icon:'🪙', label:'Coins'},
    {key:'energy',icon:'⚡', label:'Energi'},
    {key:'population', icon:'👥', label:'Penduduk'}
  ]
};

CONFIG.clearReward = {tree:{wood:5}, rock:{stone:4}};
CONFIG.modes = {
  classic: CONFIG.mode,
  tutorial: {id:'tutorial', name:'Tutorial', width:12, height:9,
    startResources:{food:60, wood:100, stone:60, coins:450, energy:0}, startPopulation:5,
    treeDensity:0.15, rockDensity:0.08}
};
