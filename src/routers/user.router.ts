import express from 'express';

import { ROUTES } from '../utils/constants';

import userValidator from '../validators/user.validator';
import userController from '../controllers/user.controller';

const router = express.Router();

router.post(ROUTES.user.login, userValidator.login, userController.login);
router.post(ROUTES.user.register, userValidator.register, userController.register.bind(userController));

export default router;
