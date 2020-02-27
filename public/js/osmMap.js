
map = new OpenLayers.Map("mapViewDivOsm");
map.addLayer(new OpenLayers.Layer.OSM());

var lonLat = new OpenLayers.LonLat(13.01530, 55.62348)
  .transform(
    new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
    map.getProjectionObject() // to Spherical Mercator Projection
  );

var zoom = 13; // or 14

//var markers = new OpenLayers.Layer.Markers( "Markers" );
//map.addLayer(markers);

//markers.addMarker(new OpenLayers.Marker(lonLat));

map.setCenter(lonLat, zoom);
