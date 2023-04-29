import express from 'express';

import { ROUTES } from '../utils/constants';
import authMiddleware from '../middlewares/auth.middleware';
import adminMiddleware from '../middlewares/admin.middleware';

import cropValidator from '../validators/crop.validator';
import cropController from '../controllers/crop.controller';

const router = express.Router();

router.get('/', authMiddleware, cropController.get);
router.post('/', authMiddleware, adminMiddleware, cropValidator.create, cropController.create);
router.patch(
  ROUTES.crop.update,
  authMiddleware,
  adminMiddleware,
  cropValidator.update.bind(cropValidator),
  cropController.update.bind(cropController),
);
router.delete(
  ROUTES.crop.delete,
  authMiddleware,
  adminMiddleware,
  cropController.delete.bind(cropController),
);

export default router;
