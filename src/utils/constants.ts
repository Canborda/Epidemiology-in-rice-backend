export const ROUTES = {
  user: {
    BASE: '/api/v1/users',
    login: '/login',
    register: '/register',
  },
  maps: {
    BASE: '/api/v1/maps',
  },
};

export const OPERATIONS = {
  user: {
    login: 'USER-LOGIN',
    get: 'USER-GET-INFO',
    register: 'USER-REGISTER',
  },
  maps: {
    get: 'MAPS-GET',
    create: 'MAPS-CREATE',
  },
};
