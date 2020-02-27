require([
  "esri/Map",
  "esri/views/SceneView"
], function (Map, SceneView) {

  var map = new Map({
    basemap: "satellite",
    ground: "world-elevation"  // show elevation
  });

  var view = new SceneView({
    container: "mapViewDivArcgis",
    map: map,
    camera: {
      position: {  // observation point
        x: 13.01530,
        y: 55.57748, // <- with 2500 m altitude 65 deg observation tilt, hamnen exact location: 55.62348, 
        z: 2500 // altitude in meters
      },
      tilt: 65  // perspective in degrees
    }
  });
});
