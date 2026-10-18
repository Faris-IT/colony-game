// Renderer: hanya menggambar, tanpa perhitungan simulasi.
window.Renderer = {
  mapEl: null, cells: [],
  build(map){
    this.mapEl = document.getElementById('map');
    this.mapEl.innerHTML = '';
    this.mapEl.style.setProperty('--cols', map.w);
    this.mapEl.style.setProperty('--rows', map.h);
    this.cells = [];
    for(let y=0; y<map.h; y++) for(let x=0; x<map.w; x++){
      const c = document.createElement('div');
      c.dataset.x = x; c.dataset.y = y; c.setAttribute('role','gridcell');
      this.mapEl.appendChild(c); this.cells.push(c);
    }
    this.drawAll(map);
  },
  cell(map,x,y){ return this.cells[y*map.w+x]; },
  drawTile(map,x,y){
    const t = map.tiles[y][x], c = this.cell(map,x,y), cur = c.classList.contains('cursor');
    c.className = 'cell v' + ((x*7 + y*13 + (x^y)) % 4) + (cur ? ' cursor' : '');
    const names = {empty:'Tanah kosong', tree:'Pohon', rock:'Batu'};
    c.innerHTML = t.type === 'empty' ? '' : Sprites.get(t.type);
    c.setAttribute('aria-label', names[t.type] || BUILDINGS[t.type].name);
    if(BUILDINGS[t.type] && (t.status === 'nostaff' || t.status === 'noinput')){
      c.classList.add('idle'); c.title = t.status === 'nostaff' ? 'Kurang pekerja' : 'Kurang ' + ((CONFIG.RESOURCES.find(r => r.key === t.missing) || {}).label || 'bahan');
    } else c.removeAttribute('title');
  },
  drawAll(map){ for(let y=0;y<map.h;y++) for(let x=0;x<map.w;x++) this.drawTile(map,x,y); },
  pulse(map,x,y){ const c=this.cell(map,x,y); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); },
  setCursor(map,x,y){
    this.cells.forEach(c=>c.classList.remove('cursor'));
    if(x!=null) this.cell(map,x,y).classList.add('cursor');
  }
};
