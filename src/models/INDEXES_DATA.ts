import { INDEXES } from '../utils/enums';
import { IndexDataI } from './interfaces';

export class Indexes {
  public indexesList: IndexDataI[];

  constructor(image: any) {
    //  Extract bands
    const red = image.select('B4');
    const green = image.select('B3');
    const blue = image.select('B2');
    const nir = image.select('B8');
    const red_edge = image.select('B5'); //TODO WHICH RED EDGE USE ?
    // Build earth-engine Image for available bands
    this.indexesList = [
      {
        name: INDEXES.NORMALIZED_DIFFERENCE_VEGETATION_INDEX,
        formula: nir.subtract(red).divide(nir.add(red)),
        visualizeOptions: {
          min: -0.2,
          max: 1,
          palette: [
            '000000',
            'A50026',
            'D73027',
            'F46D43',
            'FDAE61',
            'FEE08B',
            'FFFFBF',
            'D9EF8B',
            'A6D96A',
            '66BD63',
            '1A9850',
            '006837',
          ],
        },
      },
      {
        // FIXME FIX OPTIONS FOR RVI INDEX
        name: INDEXES.RATIO_VEGETATION_INDEX,
        formula: nir.divide(red),
        visualizeOptions: {
          min: -1,
          max: 1,
          palette: ['000000', 'FFFFFF'],
        },
      },
      /* -- ADD MORE INDEXES HERE -- */
    ];
  }
}
