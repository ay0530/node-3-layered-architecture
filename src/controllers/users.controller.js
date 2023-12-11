import dotenv from 'dotenv'; // dotenv 패키지
dotenv.config();
import bcrypt from 'bcrypt'; // bcrypt 패키지
const { hash } = bcrypt;
import { validationResult } from 'express-validator'; // express 유효성 검사 패키지
import { CustomError, ErrorTypes, UsersValidError } from '../error-handlers/custom.errors.js'; // custom 에러
import UsersService from '../services/users.services.js'; // 서비스

class UsersController {
  UsersService = new UsersService();

  // 회원 정보 저장(CREATE)
  createUser = async (req, res, next) => {
    // validationResult : express-validator 유효성 검사 실행
    const errors = validationResult(req);
    try {
      const { login_id, password, confirmPassword, name, email } = req.body; // body 값 조회

      // ERR 400 : 필수 값들이 입력되지 않은 경우
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

      // response 반환
      res.status(201).json({ userInfo: { login_id, name, email } });
    } catch (error) {
      next(error);
    }
  };

  // 내 정보 조회(Read)
  getUser = async (req, res, next) => {
    try {
      const { login_id, email, name } = res.locals.user; // localstroage 값 조회 
      // response 반환
      res.status(200).json({ myInfo: { login_id, name, email } });
    } catch (error) {
      next(error);
    }
  };
}
export default UsersController;