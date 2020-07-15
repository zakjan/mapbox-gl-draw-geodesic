import haversine from 'haversine-js';

function distance(start, end) {
  return haversine(
    { latitude: start[1], longitude: start[0] },
    { latitude: end[1], longitude: end[0] },
    { radius: haversine.EARTH.KM }
  );
}

export default distance;