import { ExistenceError, NonExistenceError } from '../utils/errors';

import { MapI, MapModel } from '../models/dtos/map.model';

class MapService {
  /**
   * Handles all operations over Map documents
   */

  // #region Main methods

  async findMap(userId: string, mapId: string, invertCoordinates: boolean): Promise<MapI> {
    const map = await MapModel.findOne({ owner: userId, _id: mapId });
    if (!map)
      throw new NonExistenceError('Map does not exists or does not belong to user', { userId, mapId });
    if (invertCoordinates) map.polygon = this.invertCoordinates(map.polygon);
    return map;
  }

  async validateMapName(userId: string, mapName: string) {
    const filter = { owner: userId, name: mapName };
    const exists = await MapModel.findOne(filter);
    if (exists) throw new ExistenceError('A map with this name already exists for the user', filter);
  }

  // #endregion

  // #region Auxiliar methods

  private invertCoordinates(coordinates: Float32List[]): Float32List[] {
    return coordinates.map(point => [point[1], point[0]]);
  }

  // #endregion
}

export default new MapService();
