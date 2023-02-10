import { calculationPossibleRangeForCoordinates } from "../utils/geographyUtils";

describe("calculationPossibleRangeForCoordinates", () => {
  it("should return correct latitude and longitude range for given radius and coordinates", () => {
    const radius = 150;
    const lat = 40.73061;
    const lng = -73.935242;
    const expectedResult = {
      lat: [37.774873058, 37.774926942],
      lng: [-122.41947302, -122.41936698],
    };

    expect(calculationPossibleRangeForCoordinates(radius, lat, lng)).toBe(
      expectedResult
    );
  });
});
