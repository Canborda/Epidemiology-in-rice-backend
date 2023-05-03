import { NonExistenceError } from '../utils/errors';

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

  getImages(polygon: Float32List[], index: string, cloudyPercentage: number) {
    // Imports
    const imageCollection = ee.ImageCollection('COPERNICUS/S2');
    const geometry = ee.Geometry.Polygon(polygon);
    // Filter imageCollection spatially, clouds and select most recent image
    let image = imageCollection
      .filterBounds(geometry)
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloudyPercentage))
      .sort('system:time_start', false)
      .first()
      .clip(geometry);
    // Check if index is available
    let indexesObj = new Indexes(image);
    let imageIndex = indexesObj.indexesList.find(idx => idx.name === index);
    if (!imageIndex) throw new NonExistenceError('Index is not supported (yet)', [`index: ${index}`]);
    // Generate image URL
    const imageUrl = ee
      .Image([imageIndex.formula.rename(index)])
      .visualize({
        bands: [imageIndex.name],
        min: imageIndex.visualizeOptions.min,
        max: imageIndex.visualizeOptions.max,
        palette: imageIndex.visualizeOptions.palette,
      })
      .getThumbURL({ dimensions: '1024x1024', format: 'png' });
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
      url: imageUrl,
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
