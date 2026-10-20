// UI: bilah sumber daya, daftar bangunan, info, laporan, notifikasi.
window.UI = {
  toastTimer: null,
  renderResources(S){
    const w = Sim.workers(S), el = document.getElementById('resources');
    let html = CONFIG.RESOURCES.map(r => {
      const pop = r.key === 'population';
      const val = pop ? `<b>${S.res.population}</b><span class="sl">/${w.employed} kerja</span>` : `<b>${S.res[r.key] || 0}</b>`;
      const tip = pop ? `Penduduk ${S.res.population}, sedang bekerja ${w.employed}, lowongan belum terisi ${Math.max(0, w.jobs - w.employed)}` : r.label;
      return `<li><button class="chip" data-res="${r.key}" title="${tip}. Klik untuk statistik harian.">${Sprites.icon(r.key)}${val}</button></li>`;
    }).join('');
    html += `<li><button class="chip" data-res="satisfaction" title="Kepuasan warga. Klik untuk statistik harian.">${Sprites.icon('satisfaction')}<b>${Math.round(S.satisfaction)}%</b></button></li>`;
    if(S.rules.showEnv) html += `<li><span class="chip" title="Kualitas lingkungan">${Sprites.icon('env')}<b>${S.env}</b></span></li>`;
    el.innerHTML = html;
    document.getElementById('dayLbl').textContent = 'Hari ' + S.day;
  },
  renderTools(tool, res){
    const el = document.getElementById('tools'), groups = {}, R = (window.Game && Game.S.rules) || {};
    const hint = id => window.HINT === id && tool !== id ? 'hint' : '';
    Object.entries(BUILDINGS).forEach(([id,d]) => (groups[d.cat] = groups[d.cat]||[]).push([id,d]));
    let html = `<button class="tool demolish ${tool==='demolish'?'on':''} ${hint('demolish')}" data-tool="demolish">Hapus / bersihkan</button>`;
    if(R.repair) html += `<button class="tool demolish ${tool==='repair'?'on':''} ${hint('repair')}" data-tool="repair">Perbaiki bangunan rusak</button>`;
    if(R.fog) html += `<button class="tool demolish ${tool==='explore'?'on':''}" data-tool="explore">Kirim ekspedisi (${BuildingSystem.costText(BuildingSystem.expeditionCost(Game.S))})</button>`;
    for(const cat in groups){
      html += `<h3>${cat}</h3><div class="grid">` + groups[cat].map(([id,d]) => {
        const cost = BuildingSystem.scaled(d.cost), ok = BuildingSystem.canAfford(cost, res);
        return `<button class="tool ${tool===id?'on':''} ${ok?'':'poor'} ${hint(id)}" data-tool="${id}" style="--b:${d.color}">
          <span class="ic">${id === 'road' ? Sprites.road(15) : Sprites.get(id)}</span><span class="nm">${d.name}</span><span class="cs">${BuildingSystem.costText(cost)}</span></button>`;
      }).join('') + '</div>';
    }
    el.innerHTML = html;
  },
  renderInfo(tool, tile){
    let html = '';
    if(tool === 'repair') html += '<p><b>Perbaiki.</b> Klik bangunan rusak. Biaya 50% dari harga bangun. Bangunan rusak tidak beroperasi.</p>';
    else if(tool === 'explore') html += '<p><b>Ekspedisi.</b> Klik petak gelap di sebelah wilayah terbuka untuk membuka area 3x3. Biaya: ' + BuildingSystem.costText(BuildingSystem.expeditionCost(Game.S)) + '.</p>';
    else if(tool === 'demolish') html += '<p><b>Mode hapus.</b> Bangunan kembali 50% biaya. Pohon dan batu memberi bahan.</p>';
    else { const d = BUILDINGS[tool], c = d.capacity;
      html += `<p><b>${d.name}</b><br>Biaya: ${BuildingSystem.costText(BuildingSystem.scaled(d.cost))}<br>Pemeliharaan: ${d.maintenance} Coins/hari`
        + (d.workersRequired ? `<br>Pekerja: ${d.workersRequired}` : '')
        + (c.population ? `<br>Menampung ${c.population} warga` + (c.populationFallback ? ` (tanpa energi: ${c.populationFallback})` : '') : '')
        + (Object.keys(d.production).length ? `<br>Hasil/hari: ${BuildingSystem.costText(d.production)}` : '')
        + (Object.keys(d.consumption).length ? `<br>Butuh/hari: ${BuildingSystem.costText(d.consumption)}` : '')
        + (tool === 'road' ? '<br>Bangunan di sebelah jalan menghasilkan +20%. Pada mode Tiny Territory jalan wajib.' : '') + '</p>'; }
    if(tile){ const names = {empty:'Tanah kosong', tree:'Pohon', rock:'Batu', swamp:'Rawa'};
      html += `<p class="tile">Petak: ${tile.hidden ? 'Belum dijelajahi' : (names[tile.type] || BUILDINGS[tile.type].name) + (tile.damaged ? ' (rusak)' : '') + (tile.site ? ' - lokasi khusus (produksi x2)' : tile.fertile ? ' - lahan subur (ladang x1,5)' : '')}</p>`; }
    document.getElementById('info').innerHTML = html;
  },
  renderReport(r){
    const f = o => Object.keys(o).length ? BuildingSystem.costText(o) : '-';
    document.getElementById('report').innerHTML = `<p><b>Hari ${r.day}</b><br>Produksi: ${f(r.prod)}<br>Konsumsi: ${f(r.cons)}<br>Biaya harian: ${Sprites.icon('coins')} ${r.maint}<br>Penduduk: ${r.pop>0?'+':''}${r.pop} (kapasitas ${r.cap})</p>`
      + (r.notes.length ? '<ul>' + r.notes.map(n => `<li>${n}</li>`).join('') + '</ul>' : '');
    document.getElementById('openReport').hidden = false;
  },
  toast(msg, bad){
    const t = document.getElementById('toast');
    t.textContent = msg; t.className = 'show' + (bad ? ' bad' : '');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => t.className = '', 2600);
  }
};
