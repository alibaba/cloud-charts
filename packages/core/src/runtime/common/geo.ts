export interface GeoJsonFeatureCollection {
  features?: Array<{
    properties?: Record<string, unknown>;
    geometry?: {
      coordinates?: unknown;
    };
  }>;
}

export function pointInPolygon(point: number[], polygon: number[][]): boolean {
  const [pointX, pointY] = point;
  let inside = false;

  for (let index = 0, previousIndex = polygon.length - 1; index < polygon.length; previousIndex = index, index += 1) {
    const [currentX, currentY] = polygon[index];
    const [previousX, previousY] = polygon[previousIndex];
    const intersects =
      currentY > pointY !== previousY > pointY &&
      pointX < ((previousX - currentX) * (pointY - currentY)) / (previousY - currentY) + currentX;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

export function isInsideChina(latitude: number, longitude: number, worldGeo?: GeoJsonFeatureCollection): boolean {
  const chinaBorderGeoJSON = worldGeo?.features?.find((item) => item.properties?.name === 'China');
  const coordinates = chinaBorderGeoJSON?.geometry?.coordinates;
  if (!Array.isArray(coordinates)) {
    return false;
  }

  return coordinates.some((polygon) => {
    const outerRing = Array.isArray(polygon) ? polygon[0] : undefined;
    return Array.isArray(outerRing) && pointInPolygon([longitude, latitude], outerRing as number[][]);
  });
}
