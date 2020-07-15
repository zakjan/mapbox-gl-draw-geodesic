function toRadians(value) {
  return value / 180 * Math.PI;
}

function toDegrees(value) {
  return value / Math.PI * 180;
}

// copied from https://stackoverflow.com/questions/57675924/calculated-midpoint-on-map-doesnt-overlap-with-geodesic-polyline
// see also https://www.movable-type.co.uk/scripts/latlong.html
function getGeodesicMidpoint(startCoord, endCoord) {
  const deltaLongitude = toRadians(endCoord[0] - startCoord[0]);
  const latitude1 = toRadians(startCoord[1]);
  const latitude2 = toRadians(endCoord[1]);
  const longitude1 = toRadians(startCoord[0]);

  const Bx = Math.cos(latitude2) * Math.cos(deltaLongitude);
  const By = Math.cos(latitude2) * Math.sin(deltaLongitude);

  const latitude = Math.atan2(
    Math.sin(latitude1) + Math.sin(latitude2),
    Math.sqrt((Math.cos(latitude1) + Bx) * (Math.cos(latitude1) + Bx) + By * By)
  );
  const longitude = longitude1 + Math.atan2(By, Math.cos(latitude1) + Bx);

  return [toDegrees(longitude), toDegrees(latitude)];
};

export default getGeodesicMidpoint;