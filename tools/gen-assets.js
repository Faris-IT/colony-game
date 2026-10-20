// Membuat gambar repository (banner, pratinjau, social preview, favicon) dari grafis dan state game yang sebenarnya.
// Jalankan: node tools/gen-assets.js
const fs = require('fs'), path = require('path');
const {game, seed, ROOT} = require('../tests/harness');
seed(2025);
const g = game('classic'), {ctx, S, B} = g, BL = ctx.BUILDINGS;
const inner = svg => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const sprite = (type, x, y, size, mask) => `<g transform="translate(${x} ${y}) scale(${size/40})">${inner(type === 'road' ? ctx.Sprites.road(mask) : ctx.Sprites.get(type))}</g>`;
const icon = (k, x, y, size) => `<g transform="translate(${x} ${y}) scale(${size/16})">${inner(ctx.Sprites.icon(k))}</g>`;
const GRASS = ['#4f8a4a', '#4a8a46', '#549650', '#478246'];
const FONT = "'Trebuchet MS','Segoe UI',Verdana,sans-serif";
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// --- Koloni contoh: disusun tangan lalu disimulasikan dengan mesin game ---
S.map.tiles.forEach((row, y) => row.forEach((t, x) => { t.type = 'empty'; if(x < 2 || y < 1 || x > 13 || y > 10){ const r = Math.random(); if(r < 0.35) t.type = 'tree'; else if(r < 0.42) t.type = 'rock'; } }));
S.res.wood = 900; S.res.stone = 600; S.res.coins = 3000;
const plan = {road:[...Array(14).keys()].map(i => [1+i, 5]).concat([...Array(8).keys()].map(i => [7, 2+i]), [...Array(5).keys()].map(i => [11, 5+i]), [...Array(9).keys()].map(i => [3+i, 8])),
  house:[[5,4],[6,4],[8,4],[9,4],[10,4],[3,4],[12,4],[5,6],[6,6],[8,6],[9,6],[12,6],[4,7],[10,7]], farm:[[2,2],[3,2],[4,2],[2,3],[3,3],[4,3]], orchard:[[13,2],[13,3]],
  sawmill:[[9,2]], quarry:[[12,2]], workshop:[[9,9]], power:[[12,9]], battery:[[13,9]], warehouse:[[5,9]], park:[[4,6],[10,6],[6,3]], market:[[8,7]], clinic:[[6,7]], school:[[3,6]]};
Object.entries(plan).forEach(([t, list]) => list.forEach(([x, y]) => { S.map.tiles[y][x].type = 'empty'; B.place(S, x, y, t); }));
S.res.population = 12; S.res.food = 80; S.res.coins = 420; S.res.wood = 96; S.res.stone = 52; S.stats.built = 41;
for(let d = 0; d < 18; d++){ S.res.wood = Math.max(S.res.wood, 90); S.res.stone = Math.max(S.res.stone, 50); ctx.Sim.runDay(S); }
S.res.coins = 436; S.res.wood = 96; S.res.stone = 52; S.res.food = 112; S.res.energy = 6;
const mapSvg = (map, ox, oy, cell, x0 = 0, y0 = 0, w = map.w, h = map.h) => {
  let s = '';
  for(let y = y0; y < y0 + h; y++) for(let x = x0; x < x0 + w; x++){
    const t = map.tiles[y][x], px = ox + (x-x0)*cell, py = oy + (y-y0)*cell;
    s += `<rect x="${px}" y="${py}" width="${cell}" height="${cell}" fill="${GRASS[(x*7 + y*13 + (x^y)) % 4]}"/>`;
    if(t.type === 'empty') continue;
    s += sprite(t.type, px, py, cell, t.type === 'road' ? ctx.Renderer.roadMask(map, x, y) : 0);
  }
  return s;
};
const goals = ctx.Modes.classic.goals(S);

// --- 1. Pratinjau gameplay (1280x720) ---
const chips = [['food', S.res.food], ['wood', S.res.wood], ['stone', S.res.stone], ['coins', S.res.coins], ['energy', S.res.energy], ['population', S.res.population + '/' + ctx.Sim.workers(S).employed + ' kerja'], ['satisfaction', Math.round(S.satisfaction) + '%']];
let cx = 690, chipSvg = '';
chips.forEach(([k, v]) => { const w = 34 + String(v).length * 9.2; chipSvg += `<rect x="${cx}" y="14" width="${w}" height="28" rx="14" fill="#2a4046"/>${icon(k, cx+8, 20, 16)}<text x="${cx+30}" y="33" font-size="14" font-weight="700" fill="#e7efe9">${esc(v)}</text>`; cx += w + 8; });
const tools = ['road','house','farm','sawmill','quarry','market','park','power'];
let toolSvg = '';
tools.forEach((t, i) => { const x = 1000 + (i % 2) * 138, y = 150 + Math.floor(i / 2) * 62, d = BL[t];
  toolSvg += `<rect x="${x}" y="${y}" width="130" height="54" rx="6" fill="none" stroke="#27414a"/><rect x="${x}" y="${y}" width="5" height="54" rx="2" fill="${d.color}"/>${sprite(t, x+11, y+6, 32, t === 'road' ? 15 : 0)}<text x="${x+50}" y="${y+22}" font-size="13" font-weight="700" fill="#e7efe9">${esc(d.name)}</text><text x="${x+50}" y="${y+42}" font-size="11.5" fill="#8fa7a6">${Object.entries(d.cost).map(([k, v]) => v).join('  ')}</text>`; });
let goalSvg = '';
goals.forEach((gl, i) => { const y = 106 + i*40, pct = gl.target ? Math.min(1, gl.cur / gl.target) : (gl.ok ? 1 : 0);
  goalSvg += `<rect x="24" y="${y}" width="226" height="32" rx="6" fill="none" stroke="${gl.ok ? '#4faa64' : '#27414a'}"/><rect x="25" y="${y+1}" width="${224*pct}" height="30" rx="5" fill="rgba(80,170,100,.25)"/><text x="34" y="${y+21}" font-size="12.5" fill="#e7efe9">${esc(gl.label)}</text><text x="240" y="${y+21}" font-size="12.5" font-weight="700" text-anchor="end" fill="#e7efe9">${gl.target ? gl.cur + '/' + gl.target : esc(gl.text || '')}</text>`; });
const preview = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" font-family="${FONT}">
<rect width="1280" height="720" fill="#0f1c20"/>
<rect width="1280" height="56" fill="#16272c"/><rect y="55" width="1280" height="1" fill="#27414a"/>
<rect x="14" y="14" width="86" height="28" rx="6" fill="none" stroke="#27414a"/><text x="27" y="33" font-size="13.5" font-weight="700" fill="#e7efe9">☰ Menu</text>
<text x="116" y="36" font-size="21" font-weight="800" fill="#e7efe9">Mufa Colony</text>
<text x="262" y="35" font-size="14" font-weight="800" fill="#e7efe9">Hari ${S.day}</text>
<rect x="320" y="14" width="140" height="28" rx="6" fill="#f0b43c"/><text x="390" y="33" font-size="13.5" font-weight="800" text-anchor="middle" fill="#1b1405">Hari berikutnya</text>
<rect x="468" y="14" width="158" height="28" rx="6" fill="none" stroke="#27414a"/><text x="547" y="33" font-size="12.5" font-weight="700" text-anchor="middle" fill="#e7efe9">▶ Jalankan otomatis</text>
${chipSvg}
<rect y="56" width="264" height="664" fill="#16272c"/><rect x="263" y="56" width="1" height="664" fill="#27414a"/>
<rect x="12" y="68" width="240" height="152" rx="10" fill="#1b2f35" stroke="#27414a"/><text x="24" y="92" font-size="12" font-weight="800" letter-spacing="1" fill="#f0b43c">TUJUAN</text>${goalSvg}
<rect x="12" y="232" width="240" height="150" rx="10" fill="#1b2f35" stroke="#27414a"/><text x="24" y="256" font-size="12" font-weight="800" letter-spacing="1" fill="#f0b43c">INFO BANGUNAN</text>
<text x="24" y="282" font-size="13" font-weight="700" fill="#e7efe9">Rumah</text><text x="24" y="302" font-size="12.5" fill="#cfe3dc">Biaya: 20 kayu, 30 Coins</text><text x="24" y="322" font-size="12.5" fill="#cfe3dc">Pemeliharaan: 1 Coins/hari</text><text x="24" y="342" font-size="12.5" fill="#cfe3dc">Menampung 4 warga</text><text x="24" y="368" font-size="12" fill="#8fa7a6">Petak: Tanah kosong</text>
<rect x="12" y="394" width="240" height="190" rx="10" fill="#1b2f35" stroke="#27414a"/><text x="24" y="418" font-size="12" font-weight="800" letter-spacing="1" fill="#f0b43c">LAPORAN HARIAN</text>
<text x="24" y="444" font-size="13" font-weight="700" fill="#e7efe9">Hari ${S.day-1}</text><text x="24" y="466" font-size="12.5" fill="#cfe3dc">Produksi: makanan +${S.lastReport.prod.food || 0}, kayu +${S.lastReport.prod.wood || 0}</text><text x="24" y="486" font-size="12.5" fill="#cfe3dc">Biaya harian: ${S.lastReport.maint} Coins</text><text x="24" y="506" font-size="12.5" fill="#cfe3dc">Penduduk: ${S.res.population} (kapasitas ${S.lastReport.cap})</text><text x="24" y="534" font-size="12.5" fill="#e0715c">• Warga butuh fasilitas sosial</text>
<rect x="1" y="57" width="1" height="1" fill="none"/>
<rect x="306" y="148" width="640" height="480" rx="8" fill="#3d7a3c"/>${mapSvg(S.map, 306, 148, 40)}
<rect x="988" y="56" width="292" height="664" fill="#16272c"/><rect x="988" y="56" width="1" height="664" fill="#27414a"/>
<rect x="1000" y="76" width="268" height="36" rx="6" fill="none" stroke="#c55" stroke-opacity=".7"/><text x="1014" y="99" font-size="13.5" font-weight="700" fill="#e7efe9">Hapus / bersihkan</text>
<text x="1000" y="140" font-size="12.5" font-weight="700" fill="#8fa7a6">Perumahan, Makanan, Industri</text>${toolSvg}
</svg>`;

// --- 2. Banner repository (1280x360) ---
const strip = (y0, rows) => { let s = ''; const seqs = rows; seqs.forEach((row, ri) => row.forEach((t, i) => { const x = i*64, y = y0 + ri*64;
  s += `<rect x="${x}" y="${y}" width="64" height="64" fill="${GRASS[(i*7 + ri*13 + (i^ri)) % 4]}"/>`;
  if(t) s += t === 'road' ? sprite('road', x, y, 64, 10) : sprite(t, x, y, 64); })); return s; };
const r1 = ['tree','','house','house','tree','','park','house','','tree','farm','farm','','house','market','','tree','house','','tree'];
const r2 = Array(20).fill('road'); r2[2] = 'road';
const r3 = ['', 'farm','','house','clinic','','house','school','tree','','power','battery','','house','house','','sawmill','','tree','rock'];
const banner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 384" width="1280" height="384" font-family="${FONT}">
<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1d22"/><stop offset="1" stop-color="#17463f"/></linearGradient>
<linearGradient id="ti" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe49a"/><stop offset="1" stop-color="#f0a92c"/></linearGradient></defs>
<rect width="1280" height="384" fill="url(#bg)"/>
<g opacity=".07" stroke="#fff">${Array.from({length:21}, (_, i) => `<path d="M${i*64} 0V384"/>`).join('')}${Array.from({length:6}, (_, i) => `<path d="M0 ${i*64}H1280"/>`).join('')}</g>
<text x="640" y="104" text-anchor="middle" font-size="88" font-weight="900" letter-spacing="6" fill="#000" opacity=".35">MUFA COLONY</text>
<text x="640" y="98" text-anchor="middle" font-size="88" font-weight="900" letter-spacing="6" fill="url(#ti)">MUFA COLONY</text>
<text x="640" y="140" text-anchor="middle" font-size="25" fill="#cfe3dc">Build Your Colony. Manage Your Future.</text>
<text x="640" y="176" text-anchor="middle" font-size="16" letter-spacing="1" fill="#8fc7b4">SIMULASI  •  STRATEGI  •  MANAJEMEN SUMBER DAYA  •  HTML + CSS + JS MURNI</text>
${strip(192, [r1, r2, r3])}
</svg>`;

// --- 3. Social preview (1280x640) ---
const social = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640" width="1280" height="640" font-family="${FONT}">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0c1d22"/><stop offset="1" stop-color="#17463f"/></linearGradient>
<linearGradient id="ti" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe49a"/><stop offset="1" stop-color="#f0a92c"/></linearGradient></defs>
<rect width="1280" height="640" fill="url(#bg)"/>
<text x="70" y="210" font-size="104" font-weight="900" letter-spacing="3" fill="#000" opacity=".3">MUFA</text><text x="70" y="204" font-size="104" font-weight="900" letter-spacing="3" fill="url(#ti)">MUFA</text>
<text x="70" y="318" font-size="104" font-weight="900" letter-spacing="3" fill="#000" opacity=".3">COLONY</text><text x="70" y="312" font-size="104" font-weight="900" letter-spacing="3" fill="url(#ti)">COLONY</text>
<text x="72" y="372" font-size="27" fill="#cfe3dc">Build Your Colony. Manage Your Future.</text>
${['12 mode + Tutorial', '6 misi Campaign', '12 pencapaian', 'Tanpa aset eksternal'].map((t, i) => `<rect x="72" y="${410 + i*46}" width="${30 + t.length*11.5}" height="34" rx="17" fill="#ffffff" fill-opacity=".1"/><text x="90" y="${433 + i*46}" font-size="18" font-weight="700" fill="#f7d774">${esc(t)}</text>`).join('')}
<rect x="676" y="76" width="540" height="488" rx="14" fill="#0b161a"/><rect x="684" y="84" width="524" height="472" rx="9" fill="#3d7a3c"/>
${mapSvg(S.map, 692, 92, 58, 1, 1, 9, 8)}
</svg>`;

// --- 4. Favicon ---
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#17463f"/><rect x="4" y="4" width="56" height="56" rx="11" fill="#4f8a4a"/>${sprite('house', 8, 6, 48)}</svg>`;

fs.mkdirSync(path.join(ROOT, 'assets'), {recursive:true});
[['preview.svg', preview], ['banner.svg', banner], ['social-preview.svg', social]].forEach(([f, s]) => fs.writeFileSync(path.join(ROOT, 'assets', f), s));
fs.writeFileSync(path.join(ROOT, 'favicon.svg'), favicon);
console.log('Aset dibuat: assets/banner.svg, preview.svg, social-preview.svg, favicon.svg');
