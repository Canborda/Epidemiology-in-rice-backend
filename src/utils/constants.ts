export const ROUTES = {
  user: {
    BASE: '/api/v1/users',
    register: '/register',
  },
  map: {
    BASE: '/api/v1/maps',
  }
};

export const OPERATIONS = {
  user: {
    login: 'USER-LOGIN',
    register: 'USER-REGISTER',
  },
  maps: {
    get: 'MAPS-GET',
    create: 'MAPS-CREATE',
  },
};
