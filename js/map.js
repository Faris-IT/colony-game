// Peta: tiap petak = {type}. type: 'empty' | 'tree' | 'rock' | id bangunan
window.MapSystem = {
  generate(w, h, treeD, rockD){
    const tiles = [];
    for(let y=0; y<h; y++){
      const row = [];
      for(let x=0; x<w; x++){
        const r = Math.random();
        row.push({type: r < treeD ? 'tree' : r < treeD+rockD ? 'rock' : 'empty'});
      }
      tiles.push(row);
    }
    const cx = w>>1, cy = h>>1; // area awal di tengah selalu kosong
    for(let y=cy-1; y<=cy+1; y++) for(let x=cx-2; x<=cx+1; x++) tiles[y][x].type = 'empty';
    return {w, h, tiles};
  },
  get(m,x,y){ return (x>=0 && y>=0 && x<m.w && y<m.h) ? m.tiles[y][x] : null; }
};
