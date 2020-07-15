import circleToPolygon from 'circle-to-polygon';

function createGeodesicCircle(center, radius, steps) {
  // circleToPolygon expects center in -180..180
  const shiftedCenter = [((center[0] + 180) % 360 + 360) % 360 - 180, center[1]];
  const shiftedPolygon = circleToPolygon(shiftedCenter, radius * 1000, steps);
  const coordinates = shiftedPolygon.coordinates[0].map(x => [x[0] + (center[0] - shiftedCenter[0]), x[1]]);
  return coordinates;
}

export default createGeodesicCircle;