import dotenv from 'dotenv'; // dotenv 패키지
dotenv.config();
import { validationResult } from 'express-validator'; // express 유효성 검사 패키지
import { UsersValidError } from '../error-handlers/custom.errors.js'; // custom 에러
import AuthService from '../services/auth.services.js'; // 서비스

class AutoController {
  authService = new AuthService();

  // 로그인 및 인증정보 생성CREATE)
  loginUser = async (req, res, next) => {
    // validationResult : express-validator 유효성 검사 실행
    const errors = validationResult(req);
    const { login_id, password } = req.body; // body 값 조회
    try {
      // ERR 400 : 필수 값들이 입력되지 않은 경우
      if (!errors.isEmpty()) {
        throw new UsersValidError();
      }

      // 토큰 조회
      const token = await this.authService.loginUser(login_id, password);
      res.cookie("Authorization", `Bearer ${token}`); //  쿠키에 토큰 저장
      // response 반환
      res.status(200).json({ token: token });
    } catch (error) {
      next(error);
    }
  };

  logoutUser = async (req, res, next) => {
    try {
      res.clearCookie('Authorization');
      res.status(200).json({ message: '로그아웃 되었습니다.' });
    } catch (error) {
      next(error);
    }
  };
}

export default AutoController;