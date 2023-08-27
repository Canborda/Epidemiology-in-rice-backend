import express from 'express';

import { ROUTES } from '../utils/constants';
import authMiddleware from '../middlewares/auth.middleware';
import adminMiddleware from '../middlewares/admin.middleware';

import indexValidator from '../validators/index.validator';
import indexController from '../controllers/index.controller';

const router = express.Router();

router.get('/', authMiddleware, indexController.getAll);
router.get(
  ROUTES.indexes.filtered,
  authMiddleware,
  indexValidator.getFiltered.bind(indexValidator),
  indexController.getFiltered.bind(indexController),
);
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  indexValidator.create.bind(indexValidator),
  indexController.create.bind(indexController),
);
router.patch(
  ROUTES.indexes.id,
  authMiddleware,
  adminMiddleware,
  indexValidator.update.bind(indexValidator),
  indexController.update.bind(indexController),
);
router.delete(
  ROUTES.indexes.id,
  authMiddleware,
  adminMiddleware,
  indexController.delete.bind(indexController),
);

export default router;
