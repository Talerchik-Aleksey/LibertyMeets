export function CovertStringCoordinates(coordinatesString: string) {
  if (!coordinatesString) {
    return null;
  }
  return coordinatesString
    .split(", ")
    .map((coordinate) => coordinate.slice(0, -1));
}
