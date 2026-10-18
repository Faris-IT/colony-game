window.CONFIG = {
  // Mode Classic (Tahap 1): peta 16x12, sumber daya awal, penduduk awal
  mode: {id:'classic', name:'Colony Classic', width:16, height:12,
         startResources:{food:40, wood:60, stone:20, coins:200, energy:0}, startPopulation:5,
         treeDensity:0.12, rockDensity:0.06},
  demolishRefund: 0.5,
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
