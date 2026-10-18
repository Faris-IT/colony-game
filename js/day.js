// Tombol hari berikutnya (penghubung UI ke Sim).
document.getElementById('nextDay').addEventListener('click', () => {
  const {S, refresh} = Game, rep = Sim.runDay(S);
  Renderer.drawAll(S.map); refresh(); UI.renderReport(rep);
});
