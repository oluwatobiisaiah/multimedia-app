import express from 'express';
import { authController } from './auth.controller';

const router = express.Router();

router.get('/', authController.index);

export default router;

