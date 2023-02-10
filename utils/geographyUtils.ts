export function calculationPossibleRangeForCoordinates(
  radiusForSearch: number,
  lat: number,
  lng: number
) {
  const radius = Number(radiusForSearch) * 1609.3444;
  console.log(radius);
  const squareLat = Number(radius) / 63046.689652997775;
  const squareLng = Number(radius) / 88560.69719092511;

  const results = {
    lat: [Number(lat) - squareLat, Number(lat) + squareLat],
    lng: [Number(lng) - squareLng, Number(lng) + squareLng],
  };
  console.log(squareLat, squareLng, results);
  return results;
}
