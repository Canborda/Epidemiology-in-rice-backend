import express from 'express';
import userController from '../controllers/user.controller';
import { ROUTES } from '../utils/constants';
import userValidator from '../validators/user.validator';

const router = express.Router();

router.post(ROUTES.user.login, userValidator.login, userController.login);
router.post(ROUTES.user.register, userValidator.register, userController.register);

export default router;
