import { destinationPoint } from './geodesy';

function createGeodesicCircle(center, radius, bearing, steps) {
  const coordinates = [];
  for (let i = 0; i < steps; ++i) {
    coordinates.push(destinationPoint(center, radius, bearing + (360 * -i) / steps));
  }
  coordinates.push(coordinates[0]);

  return coordinates;
}

export default createGeodesicCircle;