export const ROUTES = {
  users: {
    BASE: '/api/v1/users',
    login: '/login',
    signup: '/signup',
    makeAdmin: '/:user_id/make-admin',
  },
  maps: {
    BASE: '/api/v1/maps',
    delete: '/:map_id',
  },
  gee: {
    BASE: '/api/v1/gee',
    ndvi: '/ndvi',
  },
  crop: {
    BASE: '/api/v1/crops',
    update: '/:crop_id',
    delete: '/:crop_id',
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
    delete: 'CROPS-DELETE',
  },
  maps: {
    get: 'MAPS-GET',
    create: 'MAPS-CREATE',
    delete: 'MAPS-DELETE',
  },
  gee: {
    ndvi: 'GEE-GET-NDVI',
  },
};
