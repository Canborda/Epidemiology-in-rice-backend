import express from 'express';

import { ROUTES } from '../utils/constants';
import authMiddleware from '../middlewares/auth.middleware';

import mapValidator from '../validators/map.validator';
import mapController from '../controllers/map.controller';

const router = express.Router();

router.get('/', authMiddleware, mapController.get.bind(mapController));
router.post('/', authMiddleware, mapValidator.create, mapController.create.bind(mapController));
router.delete('/:map_id', authMiddleware, mapController.delete.bind(mapController));

export default router;
