import { ExistenceError, NonExistenceError } from '../utils/errors';

import { CropI, CropModel } from '../models/dtos/crop.model';

class CropService {
  /**
   * Handles all operations over Crop documents
   */

  // #region Main methods

  async getCropById(cropId: string): Promise<CropI> {
    const crop = await CropModel.findById(cropId);
    if (!crop) throw new NonExistenceError('Crop not found for given params', { cropId });
    return crop;
  }

  async getAllCrops(): Promise<CropI[]> {
    return await CropModel.find();
  }

  async createCrop(crop: CropI): Promise<CropI> {
    // Find if already exists a variety
    await this.validateCrop(crop.variety);
    // Inser new document
    const newCrop: CropI = await CropModel.create(crop);
    return newCrop;
  }

  async deleteCrop(cropId: string): Promise<void> {
    const crop = await this.getCropById(cropId);
    await crop.delete();
  }

  // #endregion

  // #region Auxiliar methods

  async validateCrop(variety: string): Promise<void> {
    const filter = { variety };
    const crop = await CropModel.findOne(filter);
    if (crop) throw new ExistenceError('A crop with the same variety already exists', filter);
  }

  // #endregion
}

export default new CropService();
