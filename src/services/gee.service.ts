const ee = require('@google/earthengine');

class GEEService {
  //#region PUBLIC methods

  test() {
    const image = new ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA').first();
    const url = image
      .visualize({ bands: ['B4', 'B3', 'B2'], gamma: 1.5 })
      .getThumbURL({ dimensions: '1024x1024', format: 'jpg' });
    return url;
  }

  //#endregion
}

export default new GEEService();
