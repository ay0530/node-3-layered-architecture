import { Router } from "express"; // express 패키지
const usersRouter = Router();
import { userSignupValidate } from '../validator/users.validator.js'; // vaild 에러
import authMiddleware from '../middlewares/auth.middleware.js'; // 인증 미들웨어 조회
import UsersController from '../controllers/users.controller.js'; // 컨트롤러
const userController = new UsersController();

// 회원 정보 저장(CREATE)
usersRouter.post('/signup', userSignupValidate, userController.createUser);

// 내 정보 조회
usersRouter.get("/me", authMiddleware, userController.getUser);

export default usersRouter;