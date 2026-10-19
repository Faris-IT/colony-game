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
  reason(t){
    if(t.status==='damaged') return 'Rusak: pakai alat Perbaiki';
    if(t.status==='nostaff') return 'Kurang pekerja';
    if(t.status==='noroad') return 'Tidak menempel jalan';
    if(t.missing==='natural') return 'Sumber daya alam habis';
    return 'Kurang ' + ((CONFIG.RESOURCES.find(r => r.key === t.missing) || {}).label || 'bahan');
  },
  drawTile(map,x,y){
    const t = map.tiles[y][x], c = this.cell(map,x,y), cur = c.classList.contains('cursor');
    c.className = 'cell v' + ((x*7 + y*13 + (x^y)) % 4) + (cur ? ' cursor' : '');
    c.removeAttribute('title');
    if(t.hidden){ c.classList.add('fog'); c.innerHTML = ''; c.setAttribute('aria-label','Belum dijelajahi'); return; }
    const names = {empty:'Tanah kosong', tree:'Pohon', rock:'Batu', swamp:'Rawa'};
    c.innerHTML = t.type === 'empty' ? (t.site ? Sprites.get('site') : t.fertile ? Sprites.get('fertile') : '') : Sprites.get(t.type);
    c.setAttribute('aria-label', names[t.type] || BUILDINGS[t.type].name);
    if(t.fertile) c.classList.add('fertile');
    if(t.site) c.classList.add('site');
    if(BUILDINGS[t.type]){
      if(t.damaged){ c.classList.add('damaged'); c.title = this.reason({status:'damaged'}); }
      else if(t.status && t.status !== 'ok'){ c.classList.add('idle'); c.title = this.reason(t); }
    }
  },
  drawAll(map){ for(let y=0;y<map.h;y++) for(let x=0;x<map.w;x++) this.drawTile(map,x,y); },
  pulse(map,x,y){ const c=this.cell(map,x,y); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); },
  setCursor(map,x,y){
    this.cells.forEach(c=>c.classList.remove('cursor'));
    if(x!=null) this.cell(map,x,y).classList.add('cursor');
  }
};
