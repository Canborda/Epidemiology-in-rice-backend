import express from 'express';

import { ROUTES } from '../utils/constants';
import authMiddleware from '../middlewares/auth.middleware';
import adminMiddleware from '../middlewares/admin.middleware';

import userValidator from '../validators/user.validator';
import userController from '../controllers/user.controller';

const router = express.Router();

router.post(ROUTES.users.login, userValidator.login, userController.login);
router.patch(ROUTES.users.makeAdmin, authMiddleware, adminMiddleware, userController.makeAdmin);

router.get('/', authMiddleware, userController.getUser);
router.post(ROUTES.users.signup, userValidator.register, userController.createUser.bind(userController));

export default router;
