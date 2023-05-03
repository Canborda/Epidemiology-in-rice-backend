import { Indexes } from '../models/INDEXES_DATA';
import { ImagesResponseI } from '../models/interfaces';

const ee = require('@google/earthengine');

class GEEService {
  /**
   * Handles all operations over images using GEE API
   * for more references go to  https://developers.google.com/earth-engine/apidocs.
   */

  getIndexes(): string[] {
    return new Indexes(new ee.Image()).indexesList.map(index => index.name);
  }

  getImages(polygon: Float32List[]) {
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
    // Compute all available indexes
    const indexesObj = new Indexes(image);
    let imageIndexes = ee.Image(indexesObj.indexesList.map(index => index.formula.rename(index.name)));
    // Generate image URL
    const imageURLs: any = {};
    indexesObj.indexesList.forEach(index => {
      imageURLs[index.name] = imageIndexes
        .visualize({
          bands: [index.name],
          min: index.visualizeOptions.min,
          max: index.visualizeOptions.max,
          palette: index.visualizeOptions.palette,
        })
        .getThumbURL({ dimensions: '1024x1024', format: 'png' });
    });
    // Extract image date from ee.Date
    const imageDate = new Date(image.date().getInfo().value);
    // Find bounding box
    let northWest = [
      Math.max(...polygon.map(coord => coord[1])),
      Math.min(...polygon.map(coord => coord[0])),
    ];
    let southEast = [
      Math.min(...polygon.map(coord => coord[1])),
      Math.max(...polygon.map(coord => coord[0])),
    ];
    const imageBbox = [northWest, southEast];
    // Return processed data
    const response: ImagesResponseI = {
      url: imageURLs,
      date: imageDate,
      bbox: imageBbox,
    };
    return response;
  }

  getNdviValues(lng: number, lat: number, cloudyPercentage: number, seedDate: string) {
    let coodrinates = ee.Geometry.Point(lng, lat);

    return coodrinates;
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
}

export default new GEEService();
