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
      c.className = 'cell'; c.dataset.x = x; c.dataset.y = y; c.setAttribute('role','gridcell');
      this.mapEl.appendChild(c); this.cells.push(c);
    }
    this.drawAll(map);
  },
  cell(map,x,y){ return this.cells[y*map.w+x]; },
  drawTile(map,x,y){
    const t = map.tiles[y][x].type, c = this.cell(map,x,y);
    c.className = 'cell';
    c.style.removeProperty('--b');
    if(t === 'empty'){ c.textContent=''; c.setAttribute('aria-label','Tanah kosong'); return; }
    if(t === 'tree'){ c.textContent='🌲'; c.classList.add('env','tree'); c.setAttribute('aria-label','Pohon'); return; }
    if(t === 'rock'){ c.textContent='🪨'; c.classList.add('env','rock'); c.setAttribute('aria-label','Batu'); return; }
    const d = BUILDINGS[t];
    c.textContent = d.icon; c.classList.add('bld', t==='road'?'road':'solid');
    c.style.setProperty('--b', d.color); c.setAttribute('aria-label', d.name);
  },
  drawAll(map){ for(let y=0;y<map.h;y++) for(let x=0;x<map.w;x++) this.drawTile(map,x,y); },
  pulse(map,x,y){ const c=this.cell(map,x,y); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); },
  setCursor(map,x,y){
    this.cells.forEach(c=>c.classList.remove('cursor'));
    if(x!=null) this.cell(map,x,y).classList.add('cursor');
  }
};
