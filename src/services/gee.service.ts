const ee = require('@google/earthengine');

class GEEService {
  //#region PUBLIC methods

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
