import express from 'express';

import { ROUTES } from '../utils/constants';
import authMiddleware from '../middlewares/auth.middleware';

import geeValidator from '../validators/gee.validator';
import geeController from '../controllers/gee.controller';

const router = express.Router();

router.get(ROUTES.gee.indexes, authMiddleware, geeController.getIndexes.bind(geeController));
router.get(ROUTES.gee.images, authMiddleware, geeValidator.get, geeController.getImages.bind(geeController));
router.get(ROUTES.gee.values, authMiddleware, geeValidator.get, geeController.getValues.bind(geeController));

router.post('/', geeController.test.bind(geeController));

export default router;
