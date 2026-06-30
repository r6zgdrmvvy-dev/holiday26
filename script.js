const places = {
  giffnock: [55.804, -4.294],
  inveraray: [56.230, -5.073],
  machrihanish: [55.431, -5.735],
  kennacraig: [55.798, -5.486],
  portAskaig: [55.848, -6.109],
  machrie: [55.658, -6.257],
  glencoe: [56.682, -5.103],
  torridon: [57.548, -5.514],
  dornoch: [57.879, -4.029],
  northBerwick: [56.058, -2.719],
  aberlady: [56.008, -2.858],
  stAndrews: [56.339, -2.796],
  fairmont: [56.321, -2.729]
};

const route1 = [places.giffnock, places.inveraray, places.machrihanish, places.kennacraig, places.portAskaig, places.machrie];
const route2 = [places.giffnock, places.glencoe, places.torridon, places.dornoch, places.giffnock];
const route3 = [places.giffnock, places.northBerwick, places.aberlady, places.stAndrews, places.giffnock];

const colours = {
  west: '#a95f3d',
  highlands: '#496a5b',
  east: '#5178a8'
};

function baseMap(id, centre=[56.35,-4.35], zoom=7){
  const map = L.map(id, { scrollWheelZoom:false }).setView(centre, zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  return map;
}

function marker(map, coords, title, body, icon='📍'){
  const html = `<div class="pin">${icon}</div>`;
  const divIcon = L.divIcon({
    html,
    className:'custom-pin',
    iconSize:[30,30],
    iconAnchor:[15,15]
  });
  return L.marker(coords, {icon: divIcon})
    .bindPopup(`<strong>${title}</strong><br>${body}`)
    .addTo(map);
}

function routeLine(map, coords, colour, label){
  return L.polyline(coords, {
    color: colour,
    weight: 5,
    opacity: .88,
    lineJoin:'round'
  }).bindPopup(label).addTo(map);
}

function addLegend(map){
  const legend = L.control({position:'bottomright'});
  legend.onAdd = function(){
    const div = L.DomUtil.create('div','legend');
    div.innerHTML = `
      <strong>Routes</strong><br>
      <span style="background:${colours.west}"></span> West & Islay<br>
      <span style="background:${colours.highlands}"></span> Highlands<br>
      <span style="background:${colours.east}"></span> East Coast
    `;
    return div;
  };
  legend.addTo(map);
}

function addAllMarkers(map){
  marker(map, places.giffnock, 'Giffnock / Glasgow', 'Starting point', '🏠');
  marker(map, places.inveraray, 'Loch Fyne Hotel & Spa', 'Route 1 first night • spa option', '💆');
  marker(map, places.machrihanish, 'The Ugadale / Machrihanish', 'Route 1 links golf base', '⛳');
  marker(map, places.kennacraig, 'Kennacraig Ferry Terminal', 'CalMac ferry to Islay', '⛴️');
  marker(map, places.portAskaig, 'Port Askaig', 'Islay arrival point', '⛴️');
  marker(map, places.machrie, 'The Machrie', 'Islay golf + relaxed wellness', '⛳');
  marker(map, places.glencoe, 'Glencoe / Ballachulish', 'Route 2 first night', '🏔️');
  marker(map, places.torridon, 'The Torridon', 'Highland luxury base', '🏨');
  marker(map, places.dornoch, 'Royal Golf Hotel / Royal Dornoch', 'Route 2 golf anchor', '⛳');
  marker(map, places.northBerwick, 'Marine North Berwick', 'Route 3 spa + North Berwick golf', '💆');
  marker(map, places.aberlady, 'Ducks Inn / Aberlady', 'Cosy East Lothian alternative', '🏨');
  marker(map, places.stAndrews, 'St Andrews', 'Rufflets, Rusacks, Fairmont, Hotel du Vin', '⛳');
}

const overview = baseMap('overview-map');
const westLayer = routeLine(overview, route1, colours.west, 'Route 1 — West & Islay');
const highLayer = routeLine(overview, route2, colours.highlands, 'Route 2 — Highlands & Royal Dornoch');
const eastLayer = routeLine(overview, route3, colours.east, 'Route 3 — East Coast & St Andrews');
addAllMarkers(overview);
addLegend(overview);
L.control.layers(null, {
  'Route 1 — West & Islay': westLayer,
  'Route 2 — Highlands': highLayer,
  'Route 3 — East Coast': eastLayer
}).addTo(overview);

const map1 = baseMap('route1-map', [55.95,-5.55], 8);
routeLine(map1, route1, colours.west, 'West & Islay route');
['giffnock','inveraray','machrihanish','kennacraig','portAskaig','machrie'].forEach(k => {
  const names = {giffnock:'Giffnock', inveraray:'Loch Fyne Hotel & Spa', machrihanish:'Machrihanish / Ugadale', kennacraig:'Kennacraig Ferry', portAskaig:'Port Askaig', machrie:'The Machrie'};
  marker(map1, places[k], names[k], 'Route 1 stop', k==='kennacraig'||k==='portAskaig'?'⛴️':k==='inveraray'?'💆':'📍');
});

const map2 = baseMap('route2-map', [56.9,-4.9], 7);
routeLine(map2, route2, colours.highlands, 'Highlands route');
['giffnock','glencoe','torridon','dornoch'].forEach(k => {
  const names = {giffnock:'Giffnock', glencoe:'Glencoe / Ballachulish', torridon:'The Torridon', dornoch:'Royal Dornoch'};
  marker(map2, places[k], names[k], 'Route 2 stop', k==='dornoch'?'⛳':k==='glencoe'?'🏔️':'📍');
});

const map3 = baseMap('route3-map', [56.1,-3.1], 8);
routeLine(map3, route3, colours.east, 'East Coast route');
['giffnock','northBerwick','aberlady','stAndrews'].forEach(k => {
  const names = {giffnock:'Giffnock', northBerwick:'Marine North Berwick', aberlady:'Aberlady / Ducks Inn', stAndrews:'St Andrews'};
  marker(map3, places[k], names[k], 'Route 3 stop', k==='northBerwick'?'💆':k==='stAndrews'?'⛳':'📍');
});
