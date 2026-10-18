// Dialog (modal), laporan harian, dan panel tujuan.
(function(){
  UI.modal = function(html, buttons){
    const m = document.getElementById('modal'), box = m.querySelector('.box');
    box.innerHTML = html + '<div class="btns"></div>';
    (buttons || [{label:'Lanjut'}]).forEach(b => {
      const e = document.createElement('button'); e.textContent = b.label;
      e.onclick = () => { m.hidden = true; if(b.fn) b.fn(); };
      box.querySelector('.btns').appendChild(e);
    });
    m.hidden = false; box.querySelector('button').focus();
  };
  document.addEventListener('keydown', e => { if(e.key === 'Escape') document.getElementById('modal').hidden = true; });
  const signed = o => Object.entries(o).filter(([k,v]) => v).map(([k,v]) => Sprites.icon(k)+' '+(v>0?'+':'')+v).join('&nbsp; ') || '-';
  UI.reportHtml = function(r){
    const f = o => Object.keys(o).length ? BuildingSystem.costText(o) : '-';
    return `<h2>Laporan hari ${r.day}</h2>
      <p>Produksi: ${f(r.prod)}</p><p>Konsumsi: ${f(r.cons)}</p>
      <p>Pajak warga: ${Sprites.icon('coins')} +${r.income}</p><p>Biaya operasional: ${Sprites.icon('coins')} ${r.maint}</p>
      <p><b>Perubahan bersih:</b> ${signed(r.delta)}</p>
      <p>Penduduk: ${r.pop>0?'+':''}${r.pop} (kapasitas ${r.cap})</p><p>Kepuasan warga: ${r.sat}%</p>`
      + (r.notes.length ? '<ul class="warn">' + r.notes.map(n => `<li>${n}</li>`).join('') + '</ul>' : '<p class="ok">Tidak ada masalah.</p>');
  };
  UI.renderGoals = function(goals){
    document.getElementById('goals').innerHTML = '<h3>Tujuan</h3>' + goals.map(g => {
      const pct = g.target ? Math.min(100, Math.round(g.cur / g.target * 100)) : (g.ok ? 100 : 0);
      return `<div class="goal ${g.ok?'done':''}"><span>${g.label}</span><b>${g.target ? g.cur+'/'+g.target : (g.text||'')}</b><i style="width:${pct}%"></i></div>`;
    }).join('');
  };
})();

UI.menu = function(){
  const go = id => () => { location.hash = id; location.reload(); };
  UI.modal('<h2>Pilih mode</h2><p><b>Tutorial</b>: belajar langkah demi langkah. Cocok untuk pemula.</p><p><b>Colony Classic</b>: bangun koloni yang stabil.</p>',
    [{label:'Tutorial', fn:go('tutorial')}, {label:'Colony Classic', fn:go('classic')}]);
};
