import { NonExistenceError } from '../utils/errors';

import { Indexes } from '../models/INDEXES_DATA';
import { IndexDataI, PixelDataI } from '../models/interfaces';

const ee = require('@google/earthengine');

class GEEService {
  /**
   * Handles all operations over images using GEE API
   * for more references go to  https://developers.google.com/earth-engine/apidocs.
   */
  private COLLECTION = 'COPERNICUS/S2';

  // #region FLOW methods

  getIndexes(): string[] {
    return new Indexes(new ee.Image()).indexesList.map(index => index.name);
  }

  selectImage(
    polygon: Float32List[],
    cloudyPercentage?: number,
    date?: string,
    getImageBeforeDate: boolean = true,
  ): any {
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
    }
    const image = filteredCollection.sort('GENERATION_TIME', !getImageBeforeDate).first().clip(geometry);
    return image;
  }

  selectImagesInRage(
    polygon: Float32List[],
    startDate: Date,
    endDate: Date,
    cloudyPercentage?: number,
  ): any {
    const geometry = ee.Geometry.Polygon(polygon);
    let filteredCollection = ee
      .ImageCollection(this.COLLECTION)
      .filterBounds(geometry)
      .filterDate(startDate, endDate);
    if (cloudyPercentage) {
      filteredCollection = filteredCollection.filter(
        ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloudyPercentage),
      );
    }
    return filteredCollection;
  }

  generateImageUrl(image: any, index: string): string {
    let imageIndex: IndexDataI = this.getIndexesObj(image, index);
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

  extractPixels(image: any, index: string, polygon: Float32List[]): PixelDataI[] {
    let imageIndex: IndexDataI = this.getIndexesObj(image, index);
    let imageBands = imageIndex.formula.rename(index).addBands(ee.Image.pixelLonLat());
    let bandValues = imageBands.reduceRegion(ee.Reducer.toList(), ee.Geometry.Polygon(polygon));
    let features = ee.Array(bandValues.values()).transpose().toList();
    let pixels: PixelDataI[] = features.getInfo().map((feature: any) => {
      const pixel: PixelDataI = {
        value: feature[0],
        latitude: feature[1],
        longitude: feature[2],
      };
      return pixel;
    });
    return pixels;
  }

  calculatePixelsAverage(pixels: PixelDataI[]): number {
    const sum = pixels.reduce(
      (accumulator: number, currentValue: PixelDataI) => accumulator + currentValue.value,
      0,
    );
    return sum / pixels.length;
  }

  // #endregion

  // #region Auxiliar methods

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

  private getIndexesObj(image: any, index: string): IndexDataI {
    let indexesObj = new Indexes(image);
    let imageIndex = indexesObj.indexesList.find(idx => idx.name === index);
    if (!imageIndex) throw new NonExistenceError('Index is not supported (yet)', [`index: ${index}`]);
    return imageIndex;
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

  // #endregion
}

export default new GEEService();
