import { NonExistenceError } from '../utils/errors';

import { Indexes } from '../models/INDEXES_DATA';

const ee = require('@google/earthengine');

class GEEService {
  /**
   * Handles all operations over images using GEE API
   * for more references go to  https://developers.google.com/earth-engine/apidocs.
   */
  COLLECTION = 'COPERNICUS/S2';

  // #region FLOW methods

  getIndexes(): string[] {
    return new Indexes(new ee.Image()).indexesList.map(index => index.name);
  }

  selectImage(
    polygon: Float32List[],
    cloudyPercentage?: number,
    date?: string,
    getImageBeforeDate: boolean = true,
  ) {
    const geometry = ee.Geometry.Polygon(polygon);
    let filteredCollection = ee.ImageCollection(this.COLLECTION).filterBounds(geometry);
    if (cloudyPercentage) {
      filteredCollection = filteredCollection.filter(
        ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloudyPercentage),
      );
    }
    if (date) {
      let startDate = ee.Date(getImageBeforeDate ? '2000-01-01' : date);
      let endDate = ee.Date(getImageBeforeDate ? date : new Date().toISOString().slice(0, 10));
      if (!getImageBeforeDate) endDate = endDate.advance(1, 'day');
      filteredCollection = filteredCollection.filterDate(startDate, endDate);
      console.log(new Date(startDate.getInfo().value));
      console.log(new Date(endDate.getInfo().value));
    }
    const image = filteredCollection.sort('GENERATION_TIME', !getImageBeforeDate).first().clip(geometry);
    return image;
  }

  generateImageUrl(image: any, index: string) {
    // Calculate index (if available)
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
    return imageUrl;
  }

  getImageDate(image: any) {
    return new Date(image.date().getInfo().value);
  }

  getPolygonBoundingBox(polygon: Float32List[]) {
    let northWest = [
      Math.max(...polygon.map(coord => coord[1])),
      Math.min(...polygon.map(coord => coord[0])),
    ];
    let southEast = [
      Math.min(...polygon.map(coord => coord[1])),
      Math.max(...polygon.map(coord => coord[0])),
    ];
    return [northWest, southEast];
  }

  // #endregion

  // #region Auxiliar methods

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

  // #endregion
}

export default new GEEService();
