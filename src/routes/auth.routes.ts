import express from 'express';

import { AuthController } from '../controllers/index';

export const router = express.Router();
let authController: AuthController = new AuthController();

/**
 * POST user login
 */
router.post('/', authController.userLogin);
