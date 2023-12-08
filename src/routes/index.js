import { Router } from 'express';
const router = Router();

import authRouter from './auth.router.js';
import usersRouter from './users.router.js';
import productsRouter from './products.router.js';

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/products", productsRouter);

export default router;