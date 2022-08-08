import express from 'express';

import { ROUTES } from '../utils/constants';
import authMiddleware from '../middlewares/auth.middleware';

import geeValidator from '../validators/gee.validator';
import geeController from '../controllers/gee.controller';

const router = express.Router();

router.get(ROUTES.gee.ndvi, authMiddleware, geeValidator.get, geeController.getNdviImage.bind(geeController));

router.post('/', geeController.test.bind(geeController));

export default router;
