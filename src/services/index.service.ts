import { ExistenceError, NonExistenceError } from '../utils/errors';

import { IndexI, IndexModel } from '../models/dtos/index.model';

import varietyService from './variety.service';
import clusterService from './cluster.service';
import phenologyService from './phenology.service';

class IndexService {
  /**
   * Handles all operations over Index collection.
   */

  // #region Main methods

  async getAllIndexes(): Promise<IndexI[]> {
    return await IndexModel.find();
  }

  async getIndexById(indexId: string): Promise<IndexI> {
    const index = await IndexModel.findById(indexId);
    if (!index) throw new NonExistenceError('Index not found for given ID', { indexId });
    return index;
  }

  async getFilterdIndexes(varietyId?: string, clusterId?: string, phenologyId?: string): Promise<IndexI[]> {
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
    // Find if given phenologyId exists
    if (phenologyId) {
      await phenologyService.getPhenologyById(phenologyId);
      filter.phenologyId = phenologyId;
    }
    return await IndexModel.find(filter);
  }

  async createIndex(index: IndexI): Promise<IndexI> {
    // Find if given varietyId exists
    await varietyService.getVarietyById(index.varietyId);
    // Find if given clusterId exists
    await clusterService.getClusterById(index.clusterId);
    // Find if given phenologyId exists
    await phenologyService.getPhenologyById(index.phenologyId);
    // Find if already exists a index with given name for the given varietyId, clusterId, phenologyId
    await this.validateName(index.varietyId, index.clusterId, index.phenologyId, index.name);
    // Insert new document
    const newIndex: IndexI = await IndexModel.create(index);
    return newIndex;
  }

  // #endregion

  // #region Auxiliar methods

  async validateName(varietyId: string, clusterId: string, phenologyId: string, name: string): Promise<void> {
    const filter = { varietyId, clusterId, phenologyId, name };
    const index = await IndexModel.findOne(filter);
    if (index) throw new ExistenceError('A index with the same name already exists', filter);
  }

  // #endregion
}

export default new IndexService();
