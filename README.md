# mapbox-gl-draw-geodesic

Geodesic tools plugin for Mapbox to draw geodesic lines, polygons and circles. Geodesic calculations are isolated inside the plugin, keeping your code abstracted away from the calculations.

[Demo](https://zakjan.github.io/mapbox-gl-draw-geodesic/)

<img src="docs/screenshot@2x.jpg" alt="Screenshot" width="640" height="320">

Supported draw modes:

- draw_line_string
- draw_polygon
- draw_circle
- draw_point
- simple_select
- direct_select
- static

## Install

```
npm install mapbox-gl-draw-geodesic
```

or

```
<script src="https://unpkg.com/mapbox-gl-draw-geodesic@1.0.0/dist/mapbox-gl-draw-geodesic.min.js"></script>
```

## Usage

This plugin modes inherits from original MapboxDraw modes, adding geodesic calculation prior rendering the map features. Use it as a drop-in replacement.

```
import MapboxDraw from 'mapbox-gl-draw';
import MapboxDrawGeodesic from 'mapbox-gl-draw-geodesic';

// original modes
const draw = new MapboxDraw({
  modes: MapboxDraw.modes
});

// geodesic modes
const draw = new MapboxDraw({
  modes: MapboxDrawGeodesic.modes
});
```

The usual MapboxDraw events are fired.

### Circle GeoJSON

Circle GeoJSON format was chosen experimentally, so that it plays well with MapboxDraw internal architecture. Other formats were also considered. The current format is:

```
{
  type: 'Feature',
  properties: {
    circleRadius: radius // km
  },
  geometry: {
    type: 'Polygon',
    coordinates: [[center, center, center, center, center]] // four handles (NSEW)
  }
}
```

To future-proof your code from potential format changes, use exposed helper methods to work with circle GeoJSONs.

- createCircle(center, radius, properties?)
- isCircle(geojson)
- getCircleCenter(geojson)
- setCircleCenter(geojson, center)
- getCircleRadius(geojson)
- setCircleRadius(geojson, radius)

```
// create
const circle = MapboxDrawGeodesic.createCircle([0, 0], 100);
draw.add(circle);

// update
MapboxDrawGeodesic.setCircleCenter(circle, [10, 10]);
MapboxDrawGeodesic.setCircleRadius(circle, 200);
draw.add(circle);

map.on('draw.create', (event) => {
  const geojson = event.features[0];
  console.log('create', geojson);

  // read
  if (MapboxDrawGeodesic.isCircle(geojson)) {
    const center = MapboxDrawGeodesic.getCircleCenter(geojson);
    const radius = MapboxDrawGeodesic.getCircleRadius(geojson);
    console.log('circle', 'center', center, 'radius', radius);
  }
});
```

### Static mode

If you need to render geodesic map features, and you don't need to use the drawing capabilities, create MapboxDraw only with the static mode. Then you can add your features to the draw instance, to render them as geodesic.

```
const draw = new MapboxDraw({
  modes: {
    static: MapboxDrawGeodesic.modes.static
  }
});

draw.add({
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [[-40, 37.5], [40, 37.5], [40, 30], [-40, -30], [-40, -37.5], [40, -37.5]]
  }
});
```

## TODO

- Add draw_circle button to original MapboxDraw controls

## Sponsors

<a href="https://maritrace.com/"><img src="docs/maritrace.png" alt="MariTrace" width="370" height="84"></a>