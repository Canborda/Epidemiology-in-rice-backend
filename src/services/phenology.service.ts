import { ExistenceError, NonExistenceError } from '../utils/errors';

import { PhenologyI, PhenologyModel } from '../models/dtos/phenology.model';

import varietyService from './variety.service';
import clusterService from './cluster.service';

class PhenologyService {
  /**
   * Handles all operations over Phenology collection.
   */

  // #region Main methods

  async getAllPhenologies(): Promise<PhenologyI[]> {
    return await PhenologyModel.find();
  }

  async getPhenologyById(phenologyId: string): Promise<PhenologyI> {
    const phenology = await PhenologyModel.findById(phenologyId);
    if (!phenology) throw new NonExistenceError('Phenology not found for given ID', { phenologyId });
    return phenology;
  }

  async getFilterdPhenologies(varietyId?: string, clusterId?: string): Promise<PhenologyI[]> {
    const filter: any = {};
    // Find if given varietyId exists
    if (varietyId) {
      await varietyService.getVarietyById(varietyId);
      filter.varietyId = varietyId;
    }
    // Find if given clusterId exists
    if (clusterId) {
      await clusterService.getClusterById(clusterId);
      filter.clusterId = clusterId;
    }
    return await PhenologyModel.find(filter);
  }

  async createPhenology(phenology: PhenologyI): Promise<PhenologyI> {
    // Find if given varietyId exists
    await varietyService.getVarietyById(phenology.varietyId);
    // Find if given clusterId exists
    await clusterService.getClusterById(phenology.clusterId);
    // Find if already exists a phenology with given name for the given varietyId, clusterId
    await this.validateName(phenology.varietyId, phenology.clusterId, phenology.name);
    // Insert new document
    const newPhenology: PhenologyI = await PhenologyModel.create(phenology);
    return newPhenology;
  }

  // #endregion

  // #region Auxiliar methods

  async validateName(varietyId: string, clusterId: string, name: string): Promise<void> {
    const filter = { varietyId, clusterId, name };
    const phenology = await PhenologyModel.findOne(filter);
    if (phenology) throw new ExistenceError('A phenology with the same name already exists', filter);
  }

  // #endregion
}

export default new PhenologyService();
