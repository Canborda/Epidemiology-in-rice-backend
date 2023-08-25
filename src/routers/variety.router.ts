import express from 'express';

import { ROUTES } from '../utils/constants';
import authMiddleware from '../middlewares/auth.middleware';
import adminMiddleware from '../middlewares/admin.middleware';

import varietyValidator from '../validators/variety.validator';
import varietyController from '../controllers/variety.controller';

const router = express.Router();

router.get('/', authMiddleware, varietyController.getAll);
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  varietyValidator.create.bind(varietyValidator),
  varietyController.create.bind(varietyController),
);
router.patch(
  ROUTES.varieties.id,
  authMiddleware,
  adminMiddleware,
  varietyValidator.update.bind(varietyValidator),
  varietyController.update.bind(varietyController),
);
router.delete(
  ROUTES.varieties.id,
  authMiddleware,
  adminMiddleware,
  varietyController.delete.bind(varietyController),
);

export default router;
