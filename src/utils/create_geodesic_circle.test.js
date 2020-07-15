import createGeodesicCircle from './create_geodesic_circle';

const STEPS = 8;
const CENTER = [0, 0];
const ANTIMERIDIAN_CENTER = [CENTER[0] + 180, CENTER[1]];
const RADIUS = 100;

describe('createGeodesicCircle', () => {
  it('returns a circle', () => {
    const expectedResult = [
      [0, 0.8983152841195214],
      [-0.635230853732268, 0.6351918164605984],
      [-0.8983152841195212, 5.500369332559413e-17],
      [-0.6352308537322681, -0.6351918164605984],
      [-1.100209088914848e-16, -0.8983152841195214],
      [0.635230853732268, -0.6351918164605985],
      [0.8983152841195212, -1.6501107997678237e-16],
      [0.6352308537322682, 0.6351918164605983],
      [0, 0.8983152841195214]
    ];
    const result = createGeodesicCircle(CENTER, RADIUS, STEPS);
    expect(result).toBeDeepCloseTo(expectedResult);
  });

  it('returns a circle crossing antimeridian', () => {
    const expectedResult = [
      [180, 0.8983152841195214],
      [179.36476914626772, 0.6351918164605984],
      [179.10168471588045, 5.500369332559413e-17],
      [179.36476914626772, -0.6351918164605984],
      [180, -0.8983152841195214],
      [180.63523085373228, -0.6351918164605985],
      [180.89831528411955, -1.6501107997678237e-16],
      [180.63523085373228, 0.6351918164605983],
      [180, 0.8983152841195214]
    ];
    const result = createGeodesicCircle(ANTIMERIDIAN_CENTER, RADIUS, STEPS);
    expect(result).toBeDeepCloseTo(expectedResult);
  });
});