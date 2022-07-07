import express from 'express';

import { ROUTES } from '../utils/constants';
import authMiddleware from '../middlewares/auth.middleware';

import userValidator from '../validators/user.validator';
import userController from '../controllers/user.controller';

const router = express.Router();

router.post(ROUTES.user.login, userValidator.login, userController.login);

router.get('/', authMiddleware, userController.getUser);
router.post(ROUTES.user.register, userValidator.register, userController.createUser.bind(userController));

export default router;
