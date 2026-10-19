// Peta: tiap petak = {type, hidden?, fertile?, site?, damaged?, status?}
// type: 'empty' | 'tree' | 'rock' | 'swamp' | id bangunan
window.MapSystem = {
  tile(treeD, rockD){ const v = Math.random(); return {type: v < treeD ? 'tree' : v < treeD+rockD ? 'rock' : 'empty'}; },
  generate(w, h, treeD, rockD){
    const tiles = [];
    for(let y=0; y<h; y++){ const row = []; for(let x=0; x<w; x++) row.push(this.tile(treeD, rockD)); tiles.push(row); }
    const cx = w>>1, cy = h>>1; // area awal di tengah selalu kosong
    for(let y=cy-1; y<=cy+1; y++) for(let x=cx-2; x<=cx+1; x++) tiles[y][x].type = 'empty';
    return {w, h, tiles};
  },
  get(m,x,y){ return (x>=0 && y>=0 && x<m.w && y<m.h) ? m.tiles[y][x] : null; },
  // Lahan subur berkelompok dan terbatas
  addFertile(m, seeds){
    for(let i=0; i<seeds; i++){
      const cx = Math.floor(Math.random()*m.w), cy = Math.floor(Math.random()*m.h);
      for(let dy=-1; dy<=1; dy++) for(let dx=-1; dx<=1; dx++){
        const t = this.get(m, cx+dx, cy+dy); if(t && t.type === 'empty' && Math.random() < 0.85) t.fertile = true;
      }
    }
  },
  // Perluas peta ke kanan dan bawah dengan petak acak baru
  expand(m, dw, dh, treeD, rockD){
    const oldH = m.h; m.w += dw; m.h += dh;
    for(let y=0; y<oldH; y++) for(let i=0; i<dw; i++) m.tiles[y].push(this.tile(treeD, rockD));
    for(let y=oldH; y<m.h; y++){ const row = []; for(let x=0; x<m.w; x++) row.push(this.tile(treeD, rockD)); m.tiles.push(row); }
  },
  // Kabut: petak di luar kotak open tertutup; isinya ditentukan sejak awal. sites = lokasi sumber daya khusus.
  applyFog(m, open, sites){
    for(let y=0; y<m.h; y++) for(let x=0; x<m.w; x++){
      if(x >= open.x0 && x <= open.x1 && y >= open.y0 && y <= open.y1) continue;
      const t = m.tiles[y][x], r = Math.random(); t.hidden = true;
      t.type = r < 0.15 ? 'tree' : r < 0.23 ? 'rock' : r < 0.45 ? 'swamp' : 'empty';
      if(t.type === 'empty' && r >= 0.33 && r < 0.45) t.type = 'empty';
      if(t.type === 'empty' && Math.random() < 0.18) t.fertile = true;
    }
    sites.forEach(([x,y]) => { const t = m.tiles[y][x]; t.type = 'empty'; t.site = true; t.fertile = false; t.hidden = true; });
  }
};
