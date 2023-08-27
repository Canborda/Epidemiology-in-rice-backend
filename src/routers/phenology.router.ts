import express from 'express';

import { ROUTES } from '../utils/constants';
import authMiddleware from '../middlewares/auth.middleware';
import adminMiddleware from '../middlewares/admin.middleware';

import phenologyValidator from '../validators/phenology.validator';
import phenologyController from '../controllers/phenology.controller';

const router = express.Router();

router.get('/', authMiddleware, phenologyController.getAll);
router.get(
  ROUTES.phenologies.filtered,
  authMiddleware,
  phenologyValidator.getFiltered.bind(phenologyValidator),
  phenologyController.getFiltered.bind(phenologyController),
);
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  phenologyValidator.create.bind(phenologyValidator),
  phenologyController.create.bind(phenologyController),
);
router.patch(
  ROUTES.phenologies.id,
  authMiddleware,
  adminMiddleware,
  phenologyValidator.update.bind(phenologyValidator),
  phenologyController.update.bind(phenologyController),
);
router.delete(
  ROUTES.phenologies.id,
  authMiddleware,
  adminMiddleware,
  phenologyController.delete.bind(phenologyController),
);

export default router;
