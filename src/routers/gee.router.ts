import express from 'express';

import geeController from '../controllers/gee.controller';

const router = express.Router();

router.post('/', geeController.post);

export default router;
