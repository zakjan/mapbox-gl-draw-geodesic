import createGeodesicCircle from './create_geodesic_circle';

const STEPS = 8;
const CENTER = [0, 0];
const ANTIMERIDIAN_CENTER = [CENTER[0] + 180, CENTER[1]];
const RADIUS = 100;
const BEARING = 0;

describe('createGeodesicCircle', () => {
  it('returns a circle', () => {
    const expectedResult =       [
      [0, 0.8993203637245382],
      [-0.6359416397889428, 0.6359024713374252],
      [-0.8993203637245382, 0],
      [-0.635941639788943, -0.6359024713374252],
      [0, -0.8993203637245382],
      [0.6359416397889428, -0.6359024713374253],
      [0.8993203637245382, 0],
      [0.6359416397889431, 0.6359024713374251],
      [0, 0.899320363724538 ]
    ];
    const result = createGeodesicCircle(CENTER, RADIUS, BEARING, STEPS);
    expect(result).toBeDeepCloseTo(expectedResult);
  });

  it('returns a circle crossing antimeridian', () => {
    const expectedResult =       [
      [180, 0.8993203637245382],
      [179.36405836021106, 0.6359024713374252],
      [179.10067963627546, 0],
      [179.36405836021106, -0.6359024713374252],
      [180, -0.8993203637245382],
      [180.63594163978894, -0.6359024713374253],
      [180.89932036372457, 0],
      [180.63594163978894, 0.6359024713374251],
      [180, 0.899320363724538 ]
    ];
    const result = createGeodesicCircle(ANTIMERIDIAN_CENTER, RADIUS, BEARING, STEPS);
    expect(result).toBeDeepCloseTo(expectedResult);
  });
});