const mapContainer = document.getElementById('map');

var map = L.map('map').setView([39.742043, -104.991531], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const points = [];
let bakedBeans = 0;
let polyline;
let mode = 'pink';

mapContainer.classList.add('pink');

map.on('click', (event) => {
  if (mode === 'pink') {
    mapContainer.classList.toggle(mode);
    mode = 'dark';
    mapContainer.classList.toggle(mode);
  } else {
    mapContainer.classList.toggle(mode);
    mode = 'pink';
    mapContainer.classList.toggle(mode);
  }
  const latlng = [event.latlng.lat, event.latlng.lng];
  points.push(latlng);
  if (!polyline) {
    polyline = L.polyline(points, {
      color: '#14A53A',
      weight: 10,
    }).addTo(map);
    L.popup({
      autoClose: false,
      closeOnClick: false,
    })
    .setLatLng(latlng)
    .setContent('<img class="shiny-koffin" src="https://i.imgur.com/GthffnS.png">')
    .openOn(map);
  } else {
    polyline.setLatLngs(points);
    if (Math.random() < 0.2) {
      bakedBeans++;
      L.popup({
        autoClose: true,
        closeOnClick: true,
      })
      .setLatLng(latlng)
      .setContent(`
        <h1>TOTAL: ${bakedBeans}</h1>
        <h3>Start on trail head,<br>hike until you are happy,<br>then you drive back home.</h3>
        <div class="burried-treasure">
          <img class="burried-treasure" src="https://i.imgur.com/4EzXhBE.png">
          <img class="baked-beans" src="https://static-cdn.jtvnw.net/emoticons/v1/302039277/4.0">
        </div>
      `)
      .openOn(map);
    }
  }
});


// image of open treasure chest -> https://imgur.com/a/Voyhvsr

