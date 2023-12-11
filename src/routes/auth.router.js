import { Router } from "express"; // express 패키지
const authRouter = Router();
import { userLoginIdValidate } from '../validator/auth.validator.js'; // vaild 에러
import AuthController from '../controllers/auth.controller.js'; // 컨트롤러
const authController = new AuthController();

// 로그인 및 인증정보 생성CREATE)
authRouter.post("/login", userLoginIdValidate, authController.loginUser);

// 로그인 및 인증정보 생성CREATE)
authRouter.get("/logout", authController.logoutUser);


export default authRouter;