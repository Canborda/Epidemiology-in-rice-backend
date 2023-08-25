import { ExistenceError, NonExistenceError } from '../utils/errors';

import { VarietyI, VarietyModel } from '../models/dtos/variety.model';

class VarietyService {
  /**
   * Handles all operations over Variety documents.
   */

  // #region Main methods

  async getVarietyById(varietyId: string): Promise<VarietyI> {
    const variety = await VarietyModel.findById(varietyId);
    if (!variety) throw new NonExistenceError('Variety not found for given ID', { varietyId });
    return variety;
  }

  async getAllVarieties(): Promise<VarietyI[]> {
    return await VarietyModel.find();
  }

  async createVariety(variety: VarietyI): Promise<VarietyI> {
    // Find if already exists a variety with given name
    await this.validateName(variety.name);
    // Insert new document
    const newVariety: VarietyI = await VarietyModel.create(variety);
    return newVariety;
  }

  // #endregion

  // #region Auxiliar methods

  async validateName(name: string): Promise<void> {
    const filter = { name };
    const variety = await VarietyModel.findOne(filter);
    if (variety) throw new ExistenceError('A variety with the same name already exists', filter);
  }

  // #endregion
}

export default new VarietyService();
