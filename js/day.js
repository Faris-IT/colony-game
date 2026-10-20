// Alur hari: Hari berikutnya, mode otomatis, statistik sumber daya, akhir permainan, dan menu.
(function(){
  const {S, refresh} = Game, mode = Modes[S.modeId];
  let timer = null, speed = 1;
  const playBtn = document.getElementById('play'), speedBtn = document.getElementById('speed');
  function stop(){ clearInterval(timer); timer = null; playBtn.textContent = '▶ Jalankan otomatis'; }
  function start(){ playBtn.textContent = '⏸ Jeda otomatis'; timer = setInterval(() => step(false), 1400 / speed); }
  function end(ev){
    stop(); S.over = ev; Store.clearGame();
    const score = Scoring.final(S), isRecord = Store.trackEnd(S, ev, score);
    if(S.modeId === 'campaign' && ev.result === 'win') Store.completeMission(S.mission.id);
    Achievements.check(S, {phase:'end', result:ev.result});
    Screens.result(S, ev, {score, isRecord});
  }
  function step(manual){
    if(S.over) return stop();
    const rep = Sim.runDay(S);
    rep.expanded ? Renderer.build(S.map) : Renderer.drawAll(S.map);
    refresh(); UI.renderReport(rep);
    Store.trackDay(S, rep); Achievements.check(S, {phase:'day'});
    const ev = mode.evaluate(S);
    if(ev) return end(ev);
    if(manual && Store.data.settings.popup) UI.modal(UI.reportHtml(rep));
    else if(rep.notes.length) UI.toast(rep.notes[0], true);
  }
  document.getElementById('nextDay').onclick = () => { stop(); step(true); };
  playBtn.onclick = () => { if(S.over) return; timer ? stop() : start(); };
  speedBtn.onclick = () => { speed = speed % 3 + 1; speedBtn.textContent = 'Kecepatan: ' + speed + 'x'; if(timer){ stop(); start(); } };
  document.getElementById('menuBtn').onclick = () => { stop(); Screens.main(true); };
  document.getElementById('openReport').onclick = () => { if(S.lastReport) UI.modal(UI.reportHtml(S.lastReport)); };
  document.getElementById('resources').addEventListener('click', e => { const b = e.target.closest('.chip[data-res]'); if(b) UI.statsModal(S, b.dataset.res); });
  if(S.lastReport) UI.renderReport(S.lastReport);
  if(Game.loaded) UI.toast('Permainan dilanjutkan.');
  else if(Game.chosen) UI.modal(mode.introHtml(S), [{label:'Mulai'}]);
  else Screens.main(false);
})();
