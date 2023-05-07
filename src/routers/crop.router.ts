import express from 'express';

import { ROUTES } from '../utils/constants';
import authMiddleware from '../middlewares/auth.middleware';
import adminMiddleware from '../middlewares/admin.middleware';

import cropValidator from '../validators/crop.validator';
import cropController from '../controllers/crop.controller';

const router = express.Router();

router.get('/', authMiddleware, cropController.getAll);
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  cropValidator.create.bind(cropValidator),
  cropController.create.bind(cropController),
);
router.patch(
  ROUTES.crops.update,
  authMiddleware,
  adminMiddleware,
  cropValidator.update.bind(cropValidator),
  cropController.update.bind(cropController),
);
router.delete(
  ROUTES.crops.delete,
  authMiddleware,
  adminMiddleware,
  cropController.delete.bind(cropController),
);

router.get(
  ROUTES.crops.phenology,
  authMiddleware,
  cropValidator.phenology,
  cropController.getPhenologyIndexValues.bind(cropController),
);

export default router;
