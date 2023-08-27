export const ROUTES = {
  users: {
    BASE: '/api/v1/users',
    login: '/login',
    signup: '/signup',
    makeAdmin: '/:user_id/make-admin',
  },
  crops: {
    BASE: '/api/v1/crops',
    update: '/:crop_id',
    delete: '/:crop_id',
    phenology: '/phenology',
  },
  maps: {
    BASE: '/api/v1/maps',
    update: '/:map_id',
    delete: '/:map_id',
  },
  varieties: {
    BASE: '/api/v1/varieties',
    id: '/:varietyId',
  },
  clusters: {
    BASE: '/api/v1/clusters',
    id: '/:clusterId',
    filtered: '/filtered',
  },
  phenologies: {
    BASE: '/api/v1/phenologies',
    id: '/:phenologyId',
    filtered: '/filtered',
  },
  gee: {
    BASE: '/api/v1/gee',
    indexes: '/indexes',
    images: '/images',
    values: '/values',
    phenology: '/phenology',
  },
};

export const OPERATIONS = {
  users: {
    login: 'USER-LOG_IN',
    get: 'USER-GET-INFO',
    signup: 'USER-SIGN_UP',
    makeAdmin: 'USER-MAKE_ADMIN',
  },
  crops: {
    get: 'CROPS-GET',
    create: 'CROPS-CREATE',
    update: 'CROPS-UPDATE',
    updateAll: 'CROPS-UPDATE_ALL',
    delete: 'CROPS-DELETE',
    phenology: 'CROPS-GET_PHENOLOGY_INDEX_VALUES',
  },
  maps: {
    get: 'MAPS-GET',
    create: 'MAPS-CREATE',
    update: 'MAPS-UPDATE',
    delete: 'MAPS-DELETE',
  },
  varieties: {
    getAll: 'VARIETIES-GET_ALL',
    create: 'VARIETIES-CREATE',
    update: 'VARIETIES-UPDATE',
    delete: 'VARIETIES-DELETE',
  },
  clusters: {
    getAll: 'CLUSTERS-GET_ALL',
    getFiltered: 'CLUSTERS-GET_FILTERED',
    create: 'CLUSTERS-CREATE',
    update: 'CLUSTERS-UPDATE',
    delete: 'CLUSTERS-DELETE',
  },
  phenologies: {
    getAll: 'PHENOLOGIES-GET_ALL',
    getFiltered: 'PHENOLOGIES-GET_FILTERED',
    create: 'PHENOLOGIES-CREATE',
    update: 'PHENOLOGIES-UPDATE',
    delete: 'PHENOLOGIES-DELETE',
  },
  gee: {
    indexes: 'GEE-GET_AVAILABLE_INDEXES',
    images: 'GEE-GET_IMAGES',
    values: 'GEE-GET_VALUES',
    phenology: 'GEE-GET_PHENOLOGY_INDEX_VALUES',
  },
};
