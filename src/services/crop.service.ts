import { ExistenceError, NonExistenceError } from '../utils/errors';

import { CropI, CropModel } from '../models/dtos/crop.model';

class CropService {
  /**
   * Handles all operations over Crop documents
   */

  // #region Main methods

  async findCrop(cropId: string): Promise<CropI> {
    const crop = await CropModel.findById(cropId);
    if (!crop) throw new NonExistenceError('Crop not found for given params', { cropId });
    return crop;
  }

  async validateCrop(name: string, variety: string): Promise<void> {
    const filter = { name, variety };
    const crop = await CropModel.findOne(filter);
    if (crop) throw new ExistenceError('A crop with the same name-variety already exists', filter);
  }

  // #endregion

  // #region Auxiliar methods

  // #endregion
}

export default new CropService();
