import { ExistenceError, NonExistenceError } from '../utils/errors';

import { ClusterI, ClusterModel } from '../models/dtos/cluster.model';

import varietyService from './variety.service';

class ClusterService {
  /**
   * Handles all operations over Cluster collection.
   */

  // #region Main methods

  async getAllClusters(): Promise<ClusterI[]> {
    return await ClusterModel.find();
  }

  async getClusterById(clusterId: string): Promise<ClusterI> {
    const cluster = await ClusterModel.findById(clusterId);
    if (!cluster) throw new NonExistenceError('Cluster not found for given ID', { clusterId });
    return cluster;
  }

  async getFilterdClusters(varietyId: string): Promise<ClusterI[]> {
    // Find if given varietyId exists
    await varietyService.getVarietyById(varietyId);
    return await ClusterModel.find({ varietyId });
  }

  async createCluster(cluster: ClusterI): Promise<ClusterI> {
    // Find if given varietyId exists
    await varietyService.getVarietyById(cluster.varietyId);
    // Find if already exists a cluster with given name for the given varietyId
    await this.validateName(cluster.varietyId, cluster.name);
    // Insert new document
    const newCluster: ClusterI = await ClusterModel.create(cluster);
    return newCluster;
  }

  // #endregion

  // #region Auxiliar methods

  async validateName(varietyId: string, name: string): Promise<void> {
    const filter = { varietyId, name };
    const cluster = await ClusterModel.findOne(filter);
    if (cluster) throw new ExistenceError('A cluster with the same name already exists', filter);
  }

  // #endregion
}

export default new ClusterService();
