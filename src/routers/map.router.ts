import express from 'express';

import { ROUTES } from '../utils/constants';

import mapValidator from '../validators/map.validator';
import mapController from '../controllers/map.controller';

const router = express.Router();

router.get('/', mapValidator.get, mapController.get);
router.post('/', mapValidator.create, mapController.create.bind(mapController));

export default router;
