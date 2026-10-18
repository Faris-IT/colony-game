// UI: panel sumber daya, daftar bangunan, info petak, laporan, notifikasi.
window.UI = {
  toastTimer: null,
  renderResources(S){
    const el = document.getElementById('resources');
    el.innerHTML = CONFIG.RESOURCES.map(r => `<li title="${r.label}">${Sprites.icon(r.key)}<b>${S.res[r.key]||0}</b></li>`).join('')
      + `<li title="Kepuasan warga">${Sprites.icon('satisfaction')}<b>${S.satisfaction}%</b></li>`;
    document.getElementById('dayLbl').textContent = 'Hari ' + S.day;
  },
  renderTools(tool, res){
    const el = document.getElementById('tools'), groups = {};
    Object.entries(BUILDINGS).forEach(([id,d]) => (groups[d.cat] = groups[d.cat]||[]).push([id,d]));
    let html = `<button class="tool demolish ${tool==='demolish'?'on':''}" data-tool="demolish">Hapus / bersihkan</button>`;
    for(const cat in groups){
      html += `<h3>${cat}</h3><div class="grid">` + groups[cat].map(([id,d]) => {
        const ok = BuildingSystem.canAfford(d.cost, res);
        return `<button class="tool ${tool===id?'on':''} ${ok?'':'poor'}" data-tool="${id}" style="--b:${d.color}">
          <span class="ic">${Sprites.get(id)}</span><span class="nm">${d.name}</span><span class="cs">${BuildingSystem.costText(d.cost)}</span></button>`;
      }).join('') + '</div>';
    }
    el.innerHTML = html;
  },
  renderInfo(tool, tile){
    let html = '';
    if(tool === 'demolish') html += '<p><b>Mode hapus.</b> Bangunan kembali 50% biaya. Pohon dan batu memberi bahan.</p>';
    else { const d = BUILDINGS[tool];
      html += `<p><b>${d.name}</b><br>Biaya: ${BuildingSystem.costText(d.cost)}<br>Pemeliharaan: ${d.maintenance} Coins/hari`
        + (d.workersRequired ? `<br>Pekerja: ${d.workersRequired}` : '')
        + (d.capacity.population ? `<br>Menampung ${d.capacity.population} warga` : '')
        + (Object.keys(d.production).length ? `<br>Hasil/hari: ${BuildingSystem.costText(d.production)}` : '')
        + (Object.keys(d.consumption).length ? `<br>Butuh/hari: ${BuildingSystem.costText(d.consumption)}` : '') + '</p>'; }
    if(tile){ const names = {empty:'Tanah kosong', tree:'Pohon', rock:'Batu'};
      html += `<p class="tile">Petak: ${names[tile.type] || BUILDINGS[tile.type].name}</p>`; }
    document.getElementById('info').innerHTML = html;
  },
  renderReport(r){
    const f = o => BuildingSystem.costText(o).replace('Gratis','-');
    document.getElementById('report').innerHTML = `<h3>Laporan hari ${r.day}</h3>
      <p>Produksi: ${f(r.prod)}<br>Konsumsi: ${f(r.cons)}<br>Biaya harian: ${Sprites.icon('coins')} ${r.maint}<br>
      Penduduk: ${r.pop>0?'+':''}${r.pop} (kapasitas ${r.cap})</p>`
      + (r.notes.length ? '<ul>' + r.notes.map(n=>`<li>${n}</li>`).join('') + '</ul>' : '');
  },
  toast(msg, bad){
    const t = document.getElementById('toast');
    t.textContent = msg; t.className = 'show' + (bad ? ' bad' : '');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(()=> t.className = '', 2200);
  }
};
