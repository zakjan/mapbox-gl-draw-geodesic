import { distance as geodesyDistance, destinationPoint as geodesyDestinationPoint } from 'geodesy-fn';

// radius used by mapbox-gl, see https://github.com/mapbox/mapbox-gl-js/blob/main/src/geo/lng_lat.js#L11
const DEFAULT_RADIUS = 6371.0088;

export function distance(start, destination) {
  return geodesyDistance(start, destination, DEFAULT_RADIUS);
}

export function destinationPoint(start, distance, bearing) {
  return geodesyDestinationPoint(start, distance, bearing, DEFAULT_RADIUS);
}

export { initialBearing, midpoint } from 'geodesy-fn';