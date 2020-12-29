// see https://www.movable-type.co.uk/scripts/latlong.html
// https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js

// mean Earth radius used by mapbox-gl, see https://github.com/mapbox/mapbox-gl-js/blob/main/src/geo/lng_lat.js#L11
const radius = 6371.0088;

function toRadians(value) {
  return value / 180 * Math.PI;
}

function toDegrees(value) {
  return value / Math.PI * 180;
}

export function distance(start, end) {
  const φ1 = toRadians(start[1]), λ1 = toRadians(start[0]);
  const φ2 = toRadians(end[1]),   λ2 = toRadians(end[0]);
  const Δφ = φ2 - φ1;
  const Δλ = λ2 - λ1;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = radius * c;

  return d;
}

export function bearing(start, end) {
  const φ1 = toRadians(start[1]), λ1 = toRadians(start[0]);
  const φ2 = toRadians(end[1]),   λ2 = toRadians(end[0]);
  const Δλ = λ2 - λ1;

  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const θ = Math.atan2(y, x);

  return (toDegrees(θ) + 360) % 360;
}

export function midpoint(start, end) {
  const φ1 = toRadians(start[1]), λ1 = toRadians(start[0]);
  const φ2 = toRadians(end[1]),   λ2 = toRadians(end[0]);
  const Δλ = λ2 - λ1;

  const Bx = Math.cos(φ2) * Math.cos(Δλ);
  const By = Math.cos(φ2) * Math.sin(Δλ);
  const φ3 = Math.atan2(Math.sin(φ1) + Math.sin(φ2), Math.sqrt((Math.cos(φ1) + Bx) * (Math.cos(φ1) + Bx) + By * By));
  const λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);

  return [toDegrees(λ3), toDegrees(φ3)];
}

export function destinationPoint(start, distance, bearing) {
  const φ1 = toRadians(start[1]), λ1 = toRadians(start[0]);
  const δ = distance / radius;
  const θ = toRadians(bearing);

  const sinφ2 = Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ);
  const φ2 = Math.asin(sinφ2);
  const y = Math.sin(θ) * Math.sin(δ) * Math.cos(φ1);
  const x = Math.cos(δ) - Math.sin(φ1) * sinφ2;
  const λ2 = λ1 + Math.atan2(y, x);

  return [toDegrees(λ2), toDegrees(φ2)];
}