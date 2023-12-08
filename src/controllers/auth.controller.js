import dotenv from 'dotenv'; // dotenv 패키지
dotenv.config();
import jwt from 'jsonwebtoken'; // jwt 패키지
import bcrypt from 'bcrypt'; // bcrypt 패키지
const { compare } = bcrypt;
import { validationResult } from 'express-validator'; // express 유효성 검사 패키지
import { CustomError, ErrorTypes, UsersValidError } from '../error-handlers/custom.errors.js'; // custom 에러
import AuthService from '../services/auth.services.js'; // 서비스

class AutoRepository {
  AuthService = new AuthService();

  // 로그인 및 인증정보 생성CREATE)
  loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        throw new UsersValidError();
      }

      const { login_id, password } = req.body; // body 값 조회

      // 조회 : 회원 정보
      const user = await this.AuthService.getUser(login_id);

      // ERR 400 : 아이디, 이메일 미존재
      if (!user) {
        throw new CustomError(ErrorTypes.UserloginIdNotExistError);
      }

      // 비밀번호 암호화
      const passwordValue = user[0].password;
      const equalPassword = await compare(password, passwordValue);

      // ERR 404 : 비밀번호 불일치
      if (!equalPassword) {
        throw new CustomError(ErrorTypes.UserPasswordMismatchError);
      }

      // 로그인 성공 시 토큰 생성
      const token = await jwt.sign({ login_id }, "lay-secret-key", { expiresIn: "12h" });
      res.cookie("Authorization", `Bearer ${token}`); // res.cookie("Authorization", `Bearer ${token}`) : 쿠키에 토큰 저장
      res.status(200).json({ token: token });
    } catch (error) {
      next(error);
    }
  };
}
export default AutoRepository;