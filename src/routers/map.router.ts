import express from 'express';

import { ROUTES } from '../utils/constants';

import mapValidator from '../validators/map.validator';
import mapController from '../controllers/map.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, mapController.get.bind(mapController));
router.post('/', authMiddleware, mapValidator.create, mapController.create.bind(mapController));

export default router;
