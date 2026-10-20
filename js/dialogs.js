// Dialog (modal), laporan harian, statistik sumber daya, dan panel tujuan.
(function(){
  UI.modal = function(html, buttons, cls){
    const m = document.getElementById('modal'), box = m.querySelector('.box');
    box.className = 'box ' + (cls || '');
    box.innerHTML = html + '<div class="btns"></div>';
    (buttons || [{label:'Lanjut'}]).forEach(b => {
      const e = document.createElement('button'); e.textContent = b.label;
      e.onclick = () => { m.hidden = true; if(b.fn) b.fn(); };
      box.querySelector('.btns').appendChild(e);
    });
    m.hidden = false; const f = box.querySelector('button'); if(f) f.focus();
  };
  document.addEventListener('keydown', e => { if(e.key === 'Escape') document.getElementById('modal').hidden = true; });
  const signed = o => Object.entries(o).filter(([k,v]) => v).map(([k,v]) => Sprites.icon(k)+' '+(v>0?'+':'')+v).join('&nbsp; ') || '-';
  UI.reportHtml = function(r){
    const f = o => Object.keys(o).length ? BuildingSystem.costText(o) : '-';
    return `<h2>Laporan hari ${r.day}</h2>
      <p>Produksi: ${f(r.prod)}</p><p>Konsumsi: ${f(r.cons)}</p>
      ${r.sales ? '<p>Penjualan stok: '+Sprites.icon('coins')+' +'+r.sales+'</p>' : ''}<p>Pajak warga: ${Sprites.icon('coins')} +${r.income}</p><p>Biaya operasional: ${Sprites.icon('coins')} ${r.maint}</p>
      <p><b>Perubahan bersih:</b> ${signed(r.delta)}</p>
      ${r.env != null && Game.S.rules.showEnv ? '<p>Lingkungan: ' + r.env + '</p>' : ''}<p>Penduduk: ${r.pop>0?'+':''}${r.pop} (kapasitas ${r.cap}, bekerja ${r.employed})</p><p>Kepuasan warga: ${r.sat}%</p>`
      + (r.notes.length ? '<ul class="warn">' + r.notes.map(n => `<li>${n}</li>`).join('') + '</ul>' : '<p class="ok">Tidak ada masalah.</p>');
  };
  UI.renderGoals = function(goals){
    document.getElementById('goals').innerHTML = goals.map(g => {
      const pct = g.target ? Math.min(100, Math.round(g.cur / g.target * 100)) : (g.ok ? 100 : 0);
      return `<div class="goal ${g.ok?'done':''}"><span>${g.label}</span><b>${g.target ? g.cur+'/'+g.target : (g.text||'')}</b><i style="width:${pct}%"></i></div>`;
    }).join('');
  };
  // Statistik harian satu sumber daya (produksi, konsumsi, biaya bangun, stok) atau penduduk
  UI.statsModal = function(S, key){
    const names = {food:'Makanan', wood:'Kayu', stone:'Batu', coins:'Coins', energy:'Energi', population:'Penduduk', satisfaction:'Penduduk dan kepuasan'};
    const H = S.history, rows = H.slice(-10).reverse();
    let html = `<h2>${names[key]}: statistik harian</h2>`;
    if(!H.length) return UI.modal(html + '<p>Belum ada data. Jalankan satu hari dulu.</p>', [{label:'Tutup'}], 'wide');
    if(key === 'population' || key === 'satisfaction'){
      html += `<p>Sekarang: ${S.res.population} penduduk, kepuasan ${Math.round(S.satisfaction)}%.</p><table class="tbl"><tr><th>Hari</th><th>Penduduk</th><th>Bekerja</th><th>Kapasitas</th><th>Kepuasan</th></tr>`
        + rows.map(h => `<tr><td>${h.day}</td><td>${h.pop}</td><td>${h.emp}</td><td>${h.cap}</td><td>${h.sat}%</td></tr>`).join('') + '</table>';
    } else {
      const last = H.slice(-7), avg = f => Math.round(last.reduce((s,h) => s + h.r[key][f], 0) / last.length * 10) / 10;
      const D = H.slice(-15), mx = Math.max(1, ...D.flatMap(h => [h.r[key].p, h.r[key].c]));
      const bars = D.map((h,i) => { const p = h.r[key].p/mx*58, c = h.r[key].c/mx*58;
        return `<rect x="${i*20+3}" y="${64-p}" width="8" height="${p}" fill="#4faa64"/><rect x="${i*20+12}" y="${64-c}" width="8" height="${c}" fill="#d9694f"/>`; }).join('');
      html += `<p>Stok sekarang: <b>${S.res[key]}</b>. Rata-rata 7 hari terakhir: produksi <b>${avg('p')}</b>, konsumsi <b>${avg('c')}</b> per hari.</p>
        <svg class="chart" viewBox="0 0 304 68" role="img" aria-label="Grafik produksi (hijau) dan konsumsi (merah)">${bars}</svg>
        <p class="legend"><span class="g">Produksi</span> <span class="r">Konsumsi</span> (15 hari terakhir)</p>
        <table class="tbl"><tr><th>Hari</th><th>Produksi</th><th>Konsumsi${key==='coins'?' (biaya harian)':''}</th><th>Bangun</th><th>Stok</th></tr>`
        + rows.map(h => { const r = h.r[key]; return `<tr><td>${h.day}</td><td>+${r.p}</td><td>-${r.c}</td><td>${r.b ? '-'+r.b : '0'}</td><td>${r.s}</td></tr>`; }).join('') + '</table>'
        + `<p class="note">${key === 'food' ? 'Konsumsi makanan = warga makan. ' : key === 'coins' ? 'Produksi Coins = pajak, penjualan, dan produksi bangunan. ' : ''}${S.rules.sell && key !== 'coins' && key !== 'energy' ? 'Konsumsi termasuk stok yang dijual. ' : ''}Kolom Bangun = biaya pembangunan di hari itu.</p>`;
    }
    UI.modal(html, [{label:'Tutup'}], 'wide');
  };
})();
