// Layar: menu utama, pilih mode, campaign, pencapaian, statistik, pengaturan, hasil.
window.Screens = {
  ids:['tutorial','classic','speed','survival','economic','boom','tiny','green','disaster','frontier','energy','endless'],
  go(h){ location.hash = h; location.reload(); },
  bind(m){ document.querySelectorAll('#modal [data-a]').forEach(b => b.onclick = () => m[b.dataset.a](b)); },
  back(inGame){ return [{label:'Kembali', fn:() => this.main(inGame)}]; },
  main(inGame){
    const has = Store.hasGame(), btn = (a,t,s) => `<button class="big" data-a="${a}">${t}${s ? `<small>${s}</small>` : ''}</button>`;
    UI.modal(`<h2>Mufa Colony</h2><p class="tag">Build Your Colony. Manage Your Future. <span class="ver">v${CONFIG.version}</span></p><div class="mmenu">`
      + (inGame ? btn('resume','Kembali ke permainan') + btn('restart','Mulai ulang') : (has ? btn('cont','Lanjutkan permainan', Store.gameLabel()) : '') + btn('play','Main','Mode terakhir, atau Tutorial jika baru'))
      + btn('modes','Pilih mode') + btn('ach','Pencapaian') + btn('stats','Statistik') + btn('settings','Pengaturan') + '</div>', [{label:'Tutup'}], 'menu');
    this.bind({resume:() => { document.getElementById('modal').hidden = true; },
      restart:() => { const S = Game.S; this.go(S.modeId === 'campaign' ? 'campaign:' + S.missionIndex : S.modeId); },
      cont:() => this.go('continue'), play:() => this.go(Store.data.last || 'tutorial'),
      modes:() => this.modes(inGame), ach:() => this.ach(inGame), stats:() => this.stats(inGame), settings:() => this.settings(inGame)});
  },
  modes(inGame){
    const rec = Store.data.records, done = Store.data.campaign.done.length, total = CampaignLevels.length;
    const card = (id, M, info) => `<button class="mcard" data-a="mode" data-m="${id}"><b>${M.name}</b><span>${M.desc}</span><em>${M.diff}</em><small>${info}</small></button>`;
    const html = this.ids.map(id => { const r = rec[id]; return card(id, Modes[id], r ? `Rekor ${r.bestScore} | menang ${r.wins}/${r.plays}` : 'Belum dimainkan'); }).join('')
      + card('campaign', Modes.campaign, `Misi selesai ${done}/${total}`);
    UI.modal('<h2>Pilih mode</h2><div class="mgrid">' + html + '</div>', this.back(inGame), 'wide');
    this.bind({mode:b => b.dataset.m === 'campaign' ? this.campaign(inGame) : this.go(b.dataset.m)});
  },
  campaign(inGame){
    const done = Store.data.campaign.done;
    const html = CampaignLevels.map((L,i) => {
      const fin = done.includes(L.id), open = i === 0 || done.includes(CampaignLevels[i-1].id);
      return `<button class="mcard ${open ? '' : 'locked'}" data-a="mission" data-i="${i}" ${open ? '' : 'disabled'}><b>Misi ${i+1}: ${L.name}</b><span>${L.mech}</span><em>${fin ? 'Selesai' : open ? 'Terbuka' : 'Terkunci'}</em></button>`;
    }).join('');
    UI.modal('<h2>Colony Campaign</h2><p>Selesaikan misi berurutan. Tiap misi punya aturan, peta, dan target berbeda.</p><div class="mgrid">' + html + '</div>',
      [{label:'Kembali', fn:() => this.modes(inGame)}], 'wide');
    this.bind({mission:b => this.go('campaign:' + b.dataset.i)});
  },
  ach(inGame){
    const A = Achievements.list, got = A.filter(a => Store.data.ach[a.id]).length;
    UI.modal(`<h2>Pencapaian ${got}/${A.length}</h2><div class="agrid">` + A.map(a => `<div class="ach ${Store.data.ach[a.id] ? 'got' : ''}"><b>${a.name}</b><span>${a.desc}</span><em>${Store.data.ach[a.id] ? 'Terbuka' : 'Terkunci'}</em></div>`).join('') + '</div>', this.back(inGame), 'wide');
  },
  stats(inGame){
    const s = Store.data.stats, rec = Store.data.records;
    const row = (k,v) => `<tr><td>${k}</td><td>${v}</td></tr>`;
    const modes = Object.keys(rec).map(id => { const r = rec[id], M = Modes[id]; return M ? `<tr><td>${M.name}</td><td>${r.bestScore}</td><td>${r.bestDays}</td><td>${r.wins}/${r.plays}</td></tr>` : ''; }).join('');
    UI.modal('<h2>Statistik</h2><table class="tbl">' + row('Total hari bermain', s.daysPlayed) + row('Bangunan dibangun', s.built) + row('Penduduk tertinggi', s.peakPop)
      + row('Laba harian tertinggi', s.bestProfit) + row('Misi Campaign selesai', Store.data.campaign.done.length + '/' + CampaignLevels.length)
      + row('Menang / kalah', s.wins + ' / ' + s.losses) + row('Skor keseluruhan', s.totalScore) + '</table>'
      + '<h3>Rekor per mode</h3>' + (modes ? '<table class="tbl"><tr><th>Mode</th><th>Skor terbaik</th><th>Hari terlama</th><th>Menang</th></tr>' + modes + '</table>' : '<p>Belum ada rekor.</p>'), this.back(inGame), 'wide');
  },
  settings(inGame){
    const s = Store.data.settings;
    UI.modal(`<h2>Pengaturan</h2>
      <label class="set"><input type="checkbox" id="sLite"> Mode hemat animasi</label>
      <label class="set"><input type="checkbox" id="sPopup"> Tampilkan laporan harian sebagai jendela</label>
      <label class="set">Ukuran petak <select id="sCell"><option value="auto">Otomatis</option><option value="small">Kecil</option><option value="large">Besar</option></select></label>
      <button class="danger" data-a="reset">Hapus semua data progres</button>`, this.back(inGame));
    const q = id => document.getElementById(id);
    q('sLite').checked = s.lite; q('sPopup').checked = s.popup; q('sCell').value = s.cell;
    const save = () => { s.lite = q('sLite').checked; s.popup = q('sPopup').checked; s.cell = q('sCell').value; Settings.apply(); Store.save(); };
    ['sLite','sPopup','sCell'].forEach(id => q(id).onchange = save);
    this.bind({reset:() => { if(confirm('Hapus semua progres, statistik, pencapaian, dan permainan tersimpan?')){ Store.reset(); Settings.apply(); this.settings(inGame); } }});
  },
  result(S, ev, info){
    const win = ev.result === 'win', tut = S.modeId === 'tutorial', camp = S.modeId === 'campaign', st = S.stats;
    const title = ev.result === 'end' ? 'Waktu habis' : win ? (tut ? 'Tutorial selesai!' : camp ? 'Misi selesai!' : 'Koloni berhasil!') : (camp ? 'Misi gagal' : 'Koloni gagal');
    const again = camp ? 'campaign:' + S.missionIndex : S.modeId;
    let primary;
    if(win && tut) primary = {label:'Main Colony Classic', fn:() => this.go('classic')};
    else if(win && camp && S.missionIndex + 1 < CampaignLevels.length) primary = {label:'Misi berikutnya', fn:() => this.go('campaign:' + (S.missionIndex + 1))};
    else primary = {label:camp && !win ? 'Ulangi misi' : 'Main lagi', fn:() => this.go(again)};
    const cell = (k,v) => `<div><b>${v}</b><span>${k}</span></div>`;
    UI.modal(`<h2 class="${win ? 'win' : 'lose'}">${title}</h2><p>${ev.reason}</p>
      <div class="rgrid">${cell('Hari bertahan', S.day-1)}${cell('Penduduk tertinggi', st.peakPop)}${cell('Bangunan dibangun', st.built)}${cell('Skor', info.score)}</div>`
      + (info.isRecord && !tut ? '<p class="ok">Rekor baru untuk mode ini!</p>' : '')
      + ((S.newAch || []).length ? '<p>Pencapaian baru: <b>' + S.newAch.join(', ') + '</b></p>' : ''),
      [primary, {label:'Pilih mode', fn:() => this.modes(true)}, {label:'Lihat peta'}], 'result');
  }
};
