const places = {
  giffnock: [55.804, -4.294], inveraray: [56.230, -5.073], machrihanish: [55.431, -5.735],
  kennacraig: [55.798, -5.486], portAskaig: [55.848, -6.109], machrie: [55.658, -6.257],
  glencoe: [56.682, -5.103], torridon: [57.548, -5.514], dornoch: [57.879, -4.029],
  northBerwick: [56.058, -2.719], aberlady: [56.008, -2.858], stAndrews: [56.339, -2.796], fairmont: [56.321, -2.729],
  rest: [56.229, -4.858], tarbert: [55.863, -5.415], gullane: [56.036, -2.829], westSands: [56.354, -2.806], dornochBeach: [57.894, -4.014]
};

const routes = {
  west: { name:'West & Islay', colour:'#a95f3d', points:['giffnock','rest','inveraray','tarbert','machrihanish','kennacraig','portAskaig','machrie'] },
  highlands: { name:'Highlands & Royal Dornoch', colour:'#496a5b', points:['giffnock','glencoe','torridon','dornoch','giffnock'] },
  east: { name:'East Coast & St Andrews', colour:'#5178a8', points:['giffnock','northBerwick','aberlady','gullane','stAndrews','giffnock'] }
};

const markers = [
  ['giffnock','Giffnock / Glasgow','Starting point','🏠'], ['inveraray','Loch Fyne Hotel & Spa','Route 1 spa reset','💆'],
  ['machrihanish','Machrihanish / Ugadale','Links golf base','⛳'], ['kennacraig','Kennacraig Ferry','CalMac to Islay','⛴️'],
  ['portAskaig','Port Askaig','Islay arrival','⛴️'], ['machrie','The Machrie','Golf + relaxed wellness','⛳'],
  ['glencoe','Glencoe / Ballachulish','Scenic overnight','🏔️'], ['torridon','The Torridon','Highland luxury base','🏨'],
  ['dornoch','Royal Dornoch','Championship golf anchor','⛳'], ['northBerwick','Marine North Berwick','Spa + North Berwick golf','💆'],
  ['aberlady','Ducks Inn / Aberlady','Cosy East Lothian option','🏨'], ['stAndrews','St Andrews','Rufflets, Rusacks, Fairmont, Hotel du Vin','⛳'],
  ['rest','Rest and Be Thankful','Scenic stop','📷'], ['tarbert','Tarbert Harbour','Seafood / coffee stop','☕'],
  ['gullane','Gullane Beach','Guinness-friendly beach walk','🐕'], ['westSands','West Sands','Classic St Andrews beach walk','🐕'], ['dornochBeach','Dornoch Beach','Big beach walk after golf','🐕']
];

function baseMap(id, centre=[56.35,-4.35], zoom=7){
  const el = document.getElementById(id); if(!el) return null;
  const map = L.map(id, { scrollWheelZoom:false }).setView(centre, zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:18, attribution:'&copy; OpenStreetMap contributors' }).addTo(map);
  return map;
}
function divIcon(icon){ return L.divIcon({html:`<div class="pin">${icon}</div>`, className:'custom-pin', iconSize:[34,34], iconAnchor:[17,17]}); }
function addMarker(map, key, title, body, icon='📍'){
  L.marker(places[key], {icon:divIcon(icon)}).bindPopup(`<strong>${title}</strong><br>${body}`).addTo(map);
}
function straightLine(map, keys, colour, label){
  return L.polyline(keys.map(k=>places[k]), {color:colour, weight:5, opacity:.86, dashArray:'8 8'}).bindPopup(`${label} fallback line`).addTo(map);
}
async function routedLine(map, keys, colour, label){
  const coords = keys.map(k => `${places[k][1]},${places[k][0]}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  try{
    const res = await fetch(url); if(!res.ok) throw new Error('routing failed');
    const json = await res.json();
    const line = json.routes[0].geometry.coordinates.map(([lng,lat]) => [lat,lng]);
    return L.polyline(line, {color:colour, weight:6, opacity:.92}).bindPopup(`${label} — routed road line`).addTo(map);
  } catch(e){ return straightLine(map, keys, colour, label); }
}
function addLegend(map){
  const legend = L.control({position:'bottomright'});
  legend.onAdd = () => { const div = L.DomUtil.create('div','legend'); div.innerHTML = `<strong>Map key</strong><br><span style="background:${routes.west.colour}"></span> West & Islay<br><span style="background:${routes.highlands.colour}"></span> Highlands<br><span style="background:${routes.east.colour}"></span> East Coast<br><small>Solid lines use live OSRM road routing. Dashed lines are fallback.</small>`; return div; };
  legend.addTo(map);
}
async function initOverview(){
  const map = baseMap('overview-map'); if(!map) return;
  const layers = {};
  for(const [key,r] of Object.entries(routes)){ layers[r.name] = await routedLine(map, r.points, r.colour, r.name); }
  markers.forEach(m => addMarker(map, ...m)); addLegend(map); L.control.layers(null, layers).addTo(map);
}
async function initRoute(id, routeKey, centre, zoom){
  const map = baseMap(id, centre, zoom); if(!map) return;
  const r = routes[routeKey]; await routedLine(map, r.points, r.colour, r.name);
  markers.filter(m => r.points.includes(m[0]) || ['westSands','dornochBeach'].includes(m[0])).forEach(m => addMarker(map, ...m));
}
initOverview(); initRoute('route1-map','west',[55.95,-5.55],8); initRoute('route2-map','highlands',[56.9,-4.9],7); initRoute('route3-map','east',[56.1,-3.1],8);
