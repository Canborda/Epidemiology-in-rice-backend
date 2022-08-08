export const ROUTES = {
  users: {
    BASE: '/api/v1/users',
    login: '/login',
    signup: '/signup',
  },
  maps: {
    BASE: '/api/v1/maps',
  },
  gee: {
    BASE: '/api/v1/gee',
    ndvi: '/ndvi',
  },
};

export const OPERATIONS = {
  users: {
    login: 'USER-LOG_IN',
    get: 'USER-GET-INFO',
    signup: 'USER-SIGN_UP',
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
