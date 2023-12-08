import dotenv from 'dotenv'; // dotenv 패키지
dotenv.config();
import jwt from 'jsonwebtoken'; // jwt 패키지
import bcrypt from 'bcrypt'; // bcrypt 패키지
const { hash, compare } = bcrypt;
import { validationResult } from 'express-validator'; // express 유효성 검사 패키지
import { CustomError, ErrorTypes, UsersValidError } from '../error-handlers/custom.errors.js'; // custom 에러
import UsersService from '../services/users.services.js'; // 서비스

class UsersController {
  UsersService = new UsersService();

  createUser = async (req, res, next) => {
    // 회원 정보 저장(CREATE)
    const errors = validationResult(req);
    const { login_id, password, confirmPassword, name, email } = req.body;
    try {
      // ERR 400 : 입력하지 않은 값이 있을 경우
      if (!errors.isEmpty()) {
        throw new UsersValidError();
      }

      // ERR 400 : 아이디 중복
      const existsLoginId = await this.UsersService.getLoginId(login_id);
      if (existsLoginId) {
        throw new CustomError(ErrorTypes.UserLoginIdExistError);
      }

      // ERR 400 : 이메일 중복
      const existsEmail = await this.UsersService.getEmail(email);
      if (existsEmail) {
        throw new CustomError(ErrorTypes.UserEmailExistError);
      }

      // ERR 400 : 비밀번호 불일치
      if (password !== confirmPassword) {
        throw new CustomError(ErrorTypes.UserConfirmPwMismatchError);
      }

      // 비밀번호 암호화
      const newPassword = await hash(password, 10);

      // 저장 : 회원정보
      await this.UsersService.createUser(login_id, newPassword, name, email);

      res.status(201).json({ userInfo: { login_id, name, email } });
    } catch (error) {
      next(error);
    }
  };

  // 내 정보 조회
  getUser = async (req, res, next) => {
    const { login_id, email, name } = res.locals.user;
    try {
      res.status(200).json({ myInfo: { login_id, name, email } });
    } catch (error) {
      next(error);
    }
  };
}
export default UsersController;