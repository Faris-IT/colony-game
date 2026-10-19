// Alur hari: Hari berikutnya, mode otomatis (Jalankan/Jeda, kecepatan), akhir permainan, dan menu mode.
(function(){
  const {S, refresh} = Game, mode = Modes[S.modeId];
  let timer = null, speed = 1;
  const playBtn = document.getElementById('play'), speedBtn = document.getElementById('speed');
  function stop(){ clearInterval(timer); timer = null; playBtn.textContent = 'Jalankan'; }
  function start(){ playBtn.textContent = 'Jeda'; timer = setInterval(() => step(false), 1400 / speed); }
  function end(ev){
    stop(); S.over = ev;
    const st = S.stats, win = ev.result === 'win', tut = S.modeId === 'tutorial';
    const go = id => () => { location.hash = id; location.reload(); };
    UI.modal(`<h2>${ev.result === 'end' ? 'Waktu habis' : win ? (tut ? 'Tutorial selesai!' : 'Koloni berhasil!') : 'Koloni gagal'}</h2><p>${ev.reason}</p>
      <p>Bertahan ${S.day-1} hari. Penduduk tertinggi ${st.peakPop}. Bangunan dibangun ${st.built}.</p>`,
      [{label: win && tut ? 'Main Colony Classic' : 'Main lagi', fn: go(win && tut ? 'classic' : S.modeId)}, {label:'Lihat peta'}]);
  }
  function step(manual){
    if(S.over) return stop();
    const rep = Sim.runDay(S);
    rep.expanded ? Renderer.build(S.map) : Renderer.drawAll(S.map); refresh(); UI.renderReport(rep);
    const ev = mode.evaluate(S);
    if(ev) return end(ev);
    if(manual) UI.modal(UI.reportHtml(rep));
    else if(rep.notes.length) UI.toast(rep.notes[0], true);
  }
  document.getElementById('nextDay').onclick = () => { stop(); step(true); };
  playBtn.onclick = () => { if(S.over) return; timer ? stop() : start(); };
  speedBtn.onclick = () => { speed = speed % 3 + 1; speedBtn.textContent = speed + 'x'; if(timer){ stop(); start(); } };
  document.getElementById('menuBtn').onclick = () => { stop(); UI.menu(); };
  if(Game.chosen) UI.modal(mode.introHtml(), [{label:'Mulai'}]); else UI.menu();
})();
