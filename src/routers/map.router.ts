import express from 'express';

import { ROUTES } from '../utils/constants';
import authMiddleware from '../middlewares/auth.middleware';

import mapValidator from '../validators/map.validator';
import mapController from '../controllers/map.controller';

const router = express.Router();

router.get('/', authMiddleware, mapController.get);
router.post('/', authMiddleware, mapValidator.create, mapController.create.bind(mapController));
router.patch(
  ROUTES.maps.update,
  authMiddleware,
  mapValidator.update,
  mapController.update.bind(mapController),
);
router.delete(ROUTES.maps.delete, authMiddleware, mapController.delete.bind(mapController));

export default router;
