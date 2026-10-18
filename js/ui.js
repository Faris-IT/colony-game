// UI: panel sumber daya, daftar bangunan, info petak, notifikasi.
window.UI = {
  toastTimer: null,
  renderResources(res){
    const el = document.getElementById('resources');
    el.innerHTML = CONFIG.RESOURCES.map(r =>
      `<li title="${r.label}"><span>${r.icon}</span><b>${res[r.key]||0}</b></li>`).join('');
  },
  renderTools(tool, res){
    const el = document.getElementById('tools'), groups = {};
    Object.entries(BUILDINGS).forEach(([id,d]) => (groups[d.cat] = groups[d.cat]||[]).push([id,d]));
    let html = `<button class="tool demolish ${tool==='demolish'?'on':''}" data-tool="demolish">🧹 Hapus / bersihkan</button>`;
    for(const cat in groups){
      html += `<h3>${cat}</h3><div class="grid">` + groups[cat].map(([id,d]) => {
        const ok = BuildingSystem.canAfford(d.cost, res);
        return `<button class="tool ${tool===id?'on':''} ${ok?'':'poor'}" data-tool="${id}" style="--b:${d.color}">
          <span class="ic">${d.icon}</span><span class="nm">${d.name}</span><span class="cs">${BuildingSystem.costText(d.cost)}</span></button>`;
      }).join('') + '</div>';
    }
    el.innerHTML = html;
  },
  renderInfo(tool, tile){
    const el = document.getElementById('info');
    let html = '';
    if(tool === 'demolish') html += '<p><b>Mode hapus.</b> Bangunan dihapus dengan pengembalian 50% biaya. Pohon dan batu memberi bahan.</p>';
    else { const d = BUILDINGS[tool];
      html += `<p><b>${d.icon} ${d.name}</b><br>Biaya: ${BuildingSystem.costText(d.cost)}<br>Pemeliharaan: ${d.maintenance} Coins/hari`
        + (d.workersRequired ? `<br>Pekerja: ${d.workersRequired}` : '')
        + (d.capacity.population ? `<br>Menampung ${d.capacity.population} warga` : '')
        + (Object.keys(d.production).length ? `<br>Hasil/hari: ${BuildingSystem.costText(d.production)}` : '') + '</p>'; }
    if(tile){
      const names = {empty:'Tanah kosong', tree:'Pohon', rock:'Batu'};
      html += `<p class="tile">Petak: ${names[tile.type] || BUILDINGS[tile.type].name}</p>`;
    }
    el.innerHTML = html;
  },
  toast(msg, bad){
    const t = document.getElementById('toast');
    t.textContent = msg; t.className = 'show' + (bad ? ' bad' : '');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(()=> t.className = '', 2200);
  }
};
