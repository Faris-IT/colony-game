// Grafis vektor buatan sendiri (SVG inline). Semua bangunan digambar di kanvas 40x40.
(function(){
  const sh = '<ellipse cx="20" cy="35" rx="15" ry="3.5" fill="rgba(0,0,0,.22)"/>';
  const n = (c, f) => Array.from({length:c}, (_, i) => f(i)).join('');
  const S = {
    road: '<rect width="40" height="40" fill="#6c727a"/><rect y="2" width="40" height="2" fill="#8b929b"/><rect y="36" width="40" height="2" fill="#555b63"/><path d="M0 20h40" stroke="#e8e2b0" stroke-width="2" stroke-dasharray="6 5"/>',
    house: sh+'<rect x="8" y="18" width="24" height="16" fill="#ecdcb8"/><rect x="8" y="30" width="24" height="4" fill="#d6c394"/><path d="M5 20L20 6l15 14z" fill="#b8503a"/><path d="M20 6l15 14H20z" fill="#9c3f2d"/><rect x="17" y="24" width="6" height="10" fill="#6b4630"/><rect x="10" y="22" width="5" height="5" fill="#8fc6e6"/><rect x="25" y="22" width="5" height="5" fill="#8fc6e6"/>',
    apartment: sh+'<rect x="9" y="7" width="22" height="27" fill="#c3b3d6"/><rect x="9" y="7" width="22" height="3" fill="#8e7ca8"/>'+n(6,i=>`<rect x="${13+(i%2)*9}" y="${13+(i>>1)*7}" width="5" height="4" fill="#fbe9a6"/>`)+'<rect x="17" y="28" width="6" height="6" fill="#5e4c75"/>',
    farm: '<rect x="3" y="5" width="34" height="30" rx="3" fill="#8a6238"/>'+n(5,i=>`<rect x="6" y="${8+i*6}" width="28" height="3.5" rx="1.7" fill="${i%2?'#e0b83a':'#7fbf4a'}"/>`),
    orchard: '<rect x="3" y="5" width="34" height="30" rx="3" fill="#6aa34c"/>'+[[12,13],[28,13],[12,28],[28,28]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6.5" fill="#3f8a3a"/><circle cx="${x-2}" cy="${y-1}" r="1.6" fill="#e5483a"/><circle cx="${x+2}" cy="${y+2}" r="1.6" fill="#e5483a"/>`).join(''),
    sawmill: sh+'<rect x="6" y="16" width="28" height="18" fill="#b98f56"/><path d="M4 17l16-9 16 9z" fill="#6f7c86"/><rect x="14" y="24" width="12" height="10" fill="#5a4026"/><circle cx="9" cy="34" r="3" fill="#c78a4a" stroke="#7a4f25"/><circle cx="31" cy="34" r="3" fill="#c78a4a" stroke="#7a4f25"/>',
    quarry: '<path d="M3 12l10-7 22 3 3 18-12 10-20-3z" fill="#7a8794"/><path d="M8 15l8-5 16 3 2 13-9 7-14-2z" fill="#56616c"/><path d="M13 20l6-3 8 2-1 8-7 3z" fill="#a8b3bd"/>',
    workshop: sh+'<rect x="5" y="17" width="30" height="17" fill="#8fa3b8"/><path d="M5 17v-7l7 7v-7l7 7v-7l7 7v-7l9 7z" fill="#6f869e"/><rect x="28" y="4" width="5" height="14" fill="#6a6f78"/><rect x="15" y="25" width="10" height="9" fill="#4d5a68"/>',
    power: sh+'<rect x="9" y="20" width="22" height="14" fill="#cdbf9a"/><rect x="12" y="6" width="6" height="16" fill="#8a8f98"/><rect x="22" y="10" width="6" height="12" fill="#8a8f98"/><path d="M23 22l-6 7h4l-2 6 7-8h-4z" fill="#f2c33a"/>',
    battery: sh+'<rect x="8" y="12" width="24" height="22" rx="3" fill="#3f9a6e"/><rect x="16" y="8" width="8" height="4" fill="#2c6e4e"/>'+n(3,i=>`<rect x="12" y="${16+i*6}" width="16" height="4" rx="1" fill="#b8f0d0"/>`),
    warehouse: sh+'<rect x="5" y="16" width="30" height="18" fill="#c9b78d"/><path d="M3 18Q20 4 37 18z" fill="#7f8c99"/><rect x="14" y="22" width="12" height="12" fill="#7a6240"/><path d="M14 22l12 12M26 22L14 34" stroke="#5c4730"/>',
    park: '<rect x="3" y="5" width="34" height="30" rx="4" fill="#6bb35a"/><path d="M4 28Q20 16 36 26" stroke="#e6d9b0" stroke-width="4" fill="none"/>'+[[11,13],[30,12],[29,32]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#2f8a4a"/><circle cx="${x-2}" cy="${y-2}" r="3" fill="#47a85c"/>`).join('')+'<rect x="14" y="26" width="8" height="3" fill="#8a5a30"/>',
    clinic: sh+'<rect x="7" y="12" width="26" height="22" fill="#eef1f4"/><rect x="7" y="12" width="26" height="4" fill="#c9d1d8"/><rect x="18" y="19" width="4" height="10" fill="#d9453d"/><rect x="15" y="22" width="10" height="4" fill="#d9453d"/>',
    school: sh+'<rect x="6" y="18" width="28" height="16" fill="#d9b86a"/><path d="M4 19L20 8l16 11z" fill="#6f5fb8"/><rect x="17" y="26" width="6" height="8" fill="#5a3f26"/><rect x="9" y="23" width="5" height="5" fill="#8fc6e6"/><rect x="26" y="23" width="5" height="5" fill="#8fc6e6"/><rect x="19.5" y="2" width="1.2" height="7" fill="#444"/><path d="M20.7 2l6 2-6 2z" fill="#e0504a"/>',
    market: sh+'<rect x="7" y="20" width="26" height="14" fill="#d9c08a"/>'+n(6,i=>`<rect x="${5+i*5}" y="12" width="5" height="9" fill="${i%2?'#fff':'#d0507a'}"/>`)+'<circle cx="14" cy="28" r="3" fill="#e0602d"/><circle cx="21" cy="28" r="3" fill="#8fc24a"/><circle cx="27" cy="28" r="3" fill="#f2c33a"/>',
    tree: '<ellipse cx="20" cy="35" rx="9" ry="3" fill="rgba(0,0,0,.22)"/><rect x="18" y="26" width="4" height="9" fill="#6b4630"/><circle cx="20" cy="18" r="11" fill="#2f7a3a"/><circle cx="16" cy="15" r="7" fill="#3f9a4a"/><circle cx="25" cy="21" r="5" fill="#2a6e34"/>',
    rock: '<ellipse cx="20" cy="33" rx="13" ry="3" fill="rgba(0,0,0,.2)"/><path d="M7 31l4-12 9-5 10 5 4 12z" fill="#8c98a3"/><path d="M11 19l9-5 10 5-10 4z" fill="#c3ccd4"/>'
  };
  const R = {
    food:'<path d="M8 14V6" stroke="#8a6a1a" stroke-width="1.5"/><ellipse cx="6" cy="6" rx="2" ry="3.2" fill="#e6b93c"/><ellipse cx="10" cy="6" rx="2" ry="3.2" fill="#e6b93c"/><ellipse cx="8" cy="3.5" rx="1.8" ry="3" fill="#f0c94c"/>',
    wood:'<rect x="2" y="5" width="12" height="7" rx="3" fill="#a36a35"/><circle cx="12" cy="8.5" r="2.7" fill="#d9a465"/><circle cx="12" cy="8.5" r="1" fill="#a36a35"/>',
    stone:'<path d="M2 12l2-6 4-3 5 3 1 6z" fill="#9aa6b0"/><path d="M4 6l4-3 5 3-5 2z" fill="#c4ced6"/>',
    coins:'<circle cx="8" cy="8" r="6" fill="#e8a921"/><circle cx="8" cy="8" r="4" fill="none" stroke="#fbe08a" stroke-width="1.2"/>',
    energy:'<path d="M9 1L3 9h4l-1 6 7-9H9z" fill="#f2c33a"/>',
    population:'<circle cx="5.5" cy="5" r="2.3" fill="#8aa2d8"/><circle cx="11" cy="6" r="2" fill="#a9bbe6"/><path d="M1 14c0-4 9-4 9 0z" fill="#8aa2d8"/><path d="M8 14c0-3 7-3 7 0z" fill="#a9bbe6"/>',
    satisfaction:'<circle cx="8" cy="8" r="6.5" fill="#f2c33a"/><circle cx="5.7" cy="6.5" r="1" fill="#5a4310"/><circle cx="10.3" cy="6.5" r="1" fill="#5a4310"/><path d="M4.7 9.6Q8 13 11.3 9.6" stroke="#5a4310" stroke-width="1.3" fill="none"/>'
  };
  window.Sprites = {
    get: t => `<svg viewBox="0 0 40 40" aria-hidden="true">${S[t]||''}</svg>`,
    icon: k => `<svg class="ri" viewBox="0 0 16 16" aria-hidden="true">${R[k]||''}</svg>`
  };
  BuildingSystem.costText = cost => Object.entries(cost).map(([k,v]) => Sprites.icon(k)+' '+v).join('&nbsp; ') || 'Gratis';
})();
