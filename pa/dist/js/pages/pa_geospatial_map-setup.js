/**********************************
* MAPBOX TOKEN AND INITIALISATION *
***********************************/

mapboxgl.accessToken = 'pk.eyJ1IjoiYmh2Y2h1YSIsImEiOiJjaXF3NGJnamIwMDlzZmttZ3k0aTF6MzV0In0.OGdQqhcSXBfafRNqDrhODg';
let map = new mapboxgl.Map({
    container: 'map',
    center: [103.8198, 1.3521],
    zoom: 11,
    style: 'mapbox://styles/mapbox/dark-v9'
});

// map.setStyle('mapbox://styles/mapbox/' + 'light' + '-v9');
// map.setStyle('mapbox://styles/mapbox/' + 'dark' + '-v9');
// map.setStyle('mapbox://styles/mapbox/' + 'streets' + '-v9');

// disable map rotation using right click + drag
map.dragRotate.disable();

// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();