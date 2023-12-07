require('dotenv').config(); // dotenv 패키지
const express = require('express'); // express 패키지
const router = express.Router();
const { PrismaClient } = require('@prisma/client'); // prisma 패키지
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken'); // jwt 패키지 - 인증
const bcrypt = require('bcrypt'); // bcrypt 패키지 - 비밀번호 해시
const authMiddleware = require('../../middlewares/auth.middleware.js'); // auth.middleware.js 조회
// 에러처리
const { CustomError, ErrorTypes, UserValidError, } = require('../../error-handlers/custom.errors.js');
const { validationResult } = require('express-validator');
const { userSignupValidate } = require('../../validator/user.validator.js');
const { userLoginIdValidate } = require('../../validator/user.validator.js');

// 회원 정보 저장(CREATE)
router.post('/signup', userSignupValidate, async (req, res, next) => {
  const errors = validationResult(req);
  const { login_id, password, confirmPassword, name, email } = req.body;
  try {
    // 입력하지 않은 값이 있을 경우;
    if (!errors.isEmpty()) {
      throw new UserValidError();
    }

    // ERR 400 : 아이디 중복
    const existsLoginId = await prisma.USER.findUnique({
      where: { login_id }
    });
    if (existsLoginId) {
      throw new CustomError(ErrorTypes.UserLoginIdExistError);
    }

    // ERR 400 : 이메일 중복
    const existsEmail = await prisma.USER.findUnique({
      where: { email }
    });
    if (existsEmail) {
      throw new CustomError(ErrorTypes.UserEmailExistError);
    }

    // 비밀번호 불일치
    if (password !== confirmPassword) {
      throw new CustomError(ErrorTypes.UserConfirmPwMismatchError);
    }

    // 저장 : 비밀번호 암호화
    // await bcrypt.hash(비밀번호, 길이); : 비밀번호를 암호화
    const newPassword = await bcrypt.hash(password, 10);
    // 저장 : 회원정보
    await prisma.USER.create({
      data: {
        login_id,
        password: newPassword,
        name,
        email,
      },
    });
    await prisma.$disconnect(); // prisma 연결 끊기

    res.status(201).json({ userInfo: { login_id, name, email } });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 로그인 및 인증정보 생성CREATE)
router.post("/login", userLoginIdValidate, async (req, res, next) => {
  try {
    const { login_id, password } = req.body; // body 값 조회

    // 조회 : 회원 정보
    const user = await prisma.USER.findMany({
      where: {
        OR: [
          { login_id: { contains: login_id, } },
          { email: { contains: login_id, } }
        ]
      }
    });

    // ERR 400 : 아이디, 이메일 미존재
    if (!user) {
      throw new CustomError(ErrorTypes.UserloginIdNotExistError);
    }

    // 비밀번호 암호화
    const passwordValue = user[0].password;
    const equalPassword = await bcrypt.compare(password, passwordValue);

    // ERR 404 : 비밀번호 불일치
    if (!equalPassword) {
      throw new CustomError(ErrorTypes.UserPasswordMismatchError);
    }

    // 로그인 성공 시 토큰 생성
    // jwt.sign({payload},"암호키",{expiresIn: 유효 시간}) : 토큰 생성
    const token = await jwt.sign({ login_id }, "lay-secret-key", { expiresIn: "12h" });
    res.cookie("Authorization", `Bearer ${token}`); // res.cookie("Authorization", `Bearer ${token}`) : 쿠키에 토큰 저장
    res.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    next(error);
    console.log(error);
  }
});

// 내 정보 조회
router.get("/me", authMiddleware, async (req, res, next) => {
  const { login_id, email, name } = res.locals.user;
  try {
    res.status(200).json({ myInfo: { login_id, name, email } });
  } catch (error) {
    console.log(error);
    next(error);
    console.log(error);
  }
});

module.exports = router;