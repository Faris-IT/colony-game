// Alur hari: Hari berikutnya, mode otomatis (Jalankan/Jeda, kecepatan), dan akhir permainan.
(function(){
  const {S, refresh} = Game, mode = Modes[S.modeId];
  let timer = null, speed = 1;
  const playBtn = document.getElementById('play'), speedBtn = document.getElementById('speed');
  function stop(){ clearInterval(timer); timer = null; playBtn.textContent = 'Jalankan'; }
  function start(){ playBtn.textContent = 'Jeda'; timer = setInterval(() => step(false), 1400 / speed); }
  function end(ev){
    stop();
    S.over = ev;
    const st = S.stats, win = ev.result === 'win';
    UI.modal(`<h2>${win ? 'Koloni berhasil!' : 'Koloni gagal'}</h2><p>${ev.reason}</p>
      <p>Bertahan ${S.day-1} hari. Penduduk tertinggi ${st.peakPop}. Bangunan dibangun ${st.built}.</p>`,
      [{label:'Main lagi', fn:() => location.reload()}, {label:'Lihat peta'}]);
  }
  function step(manual){
    if(S.over) return stop();
    const rep = Sim.runDay(S);
    Renderer.drawAll(S.map); refresh(); UI.renderReport(rep);
    const ev = mode.evaluate(S);
    if(ev) return end(ev);
    if(manual) UI.modal(UI.reportHtml(rep));
    else if(rep.notes.length) UI.toast(rep.notes[0], true);
  }
  document.getElementById('nextDay').onclick = () => { stop(); step(true); };
  playBtn.onclick = () => { if(S.over) return; timer ? stop() : start(); };
  speedBtn.onclick = () => { speed = speed % 3 + 1; speedBtn.textContent = speed + 'x'; if(timer){ stop(); start(); } };
  UI.modal(`<h2>${mode.name}</h2><p>${mode.intro} Capai ${mode.targetPop} penduduk, jaga saldo Coins tetap positif, dan pertahankan persediaan makanan ${mode.foodDays} hari berturut-turut.</p>
    <p>Bangun rumah dan ladang, lalu tekan Hari berikutnya. Kalah jika penduduk habis atau kas minus ${mode.debtDays} hari berturut-turut.</p>`, [{label:'Mulai'}]);
})();
