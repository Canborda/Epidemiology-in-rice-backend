import express from 'express';

import { ROUTES } from '../utils/constants';
import authMiddleware from '../middlewares/auth.middleware';
import adminMiddleware from '../middlewares/admin.middleware';

import clusterValidator from '../validators/cluster.validator';
import clusterController from '../controllers/cluster.controller';

const router = express.Router();

router.get('/', authMiddleware, clusterController.getAll);
router.get(
  ROUTES.clusters.filtered,
  authMiddleware,
  clusterValidator.getFiltered.bind(clusterValidator),
  clusterController.getFiltered.bind(clusterController),
);
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  clusterValidator.create.bind(clusterValidator),
  clusterController.create.bind(clusterController),
);
router.patch(
  ROUTES.clusters.id,
  authMiddleware,
  adminMiddleware,
  clusterValidator.update.bind(clusterValidator),
  clusterController.update.bind(clusterController),
);
router.delete(
  ROUTES.clusters.id,
  authMiddleware,
  adminMiddleware,
  clusterController.delete.bind(clusterController),
);

export default router;
