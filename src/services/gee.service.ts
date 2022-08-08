const ee = require('@google/earthengine');

class GEEService {
  //#region PUBLIC methods

  getNdviImage(polygon: Float32List[]) {
    // Imports
    const imageCollection = ee.ImageCollection('COPERNICUS/S2');
    const geometry = ee.Geometry.Polygon(polygon);
    // Filter image spatially and temporally
    let image = imageCollection
      .filterBounds(geometry)
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
      .sort('system:time_start', false)
      .first()
      .clip(geometry);
    // Compute Normalized Difference Vegetation Index (NDVI)
    let ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
    // Process image and get URL
    const url = ndvi
      .visualize({
        bands: ['NDVI'],
        min: -1,
        max: 1,
        palette: ['blue', 'cyan', 'white', 'yellow', 'green'],
      })
      .getThumbURL({ dimensions: '1024x1024', format: 'jpg' });
    // Extract image date from ee.Date
    const date = new Date(image.date().getInfo().value);
    // Find bounding box
    let northWest = [
      Math.max(...polygon.map(coord => coord[1])),
      Math.min(...polygon.map(coord => coord[0])),
    ];
    let southEast = [
      Math.min(...polygon.map(coord => coord[1])),
      Math.max(...polygon.map(coord => coord[0])),
    ];
    const bbox = [northWest, southEast];
    // Return processed data
    return { url, date, bbox };
  }

  test() {
    const NAIP = ee.ImageCollection('USDA/NAIP/DOQQ');
    let bounds = ee.Geometry.Rectangle([
      [-105.53, 40.75],
      [-105.17, 40.56],
    ]);
    let naip2011 = NAIP.filterDate('2011-01-01', '2011-12-31').filterBounds(bounds);
    const url = naip2011
      .first()
      .visualize({ bands: ['N', 'R', 'G'], gamma: 1.5 })
      .getThumbURL({ dimensions: '1024x1024', format: 'jpg' });
    return { url, points: bounds.coordinates_ };
  }

  //#endregion
}

export default new GEEService();
