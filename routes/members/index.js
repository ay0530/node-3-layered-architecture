require('dotenv').config(); // dotenv 패키지
const express = require('express'); // express 패키지
const router = express.Router();
const { PrismaClient } = require('@prisma/client'); // prisma 패키지
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken'); // jwt 패키지 - 인증
const bcrypt = require('bcrypt'); // bcrypt 패키지 - 비밀번호 해시
const authMiddleware = require('../../middlewares/auth-middleware.js'); // auth-middleware.js 조회



// 회원 정보 저장(CREATE)
router.post('/signup', async (req, res) => {
  const { login_id, password, confirmPassword, name, email } = req.body;
  try {
    // ERR 400 : 아이디 중복
    const existslogin_id = await prisma.USER.findUnique({
      where: { login_id }
    });
    if (existslogin_id) { throw new Error("400-아이디중복"); }

    // ERR 400 : 이메일 중복
    const existsEmail = await prisma.USER.findUnique({
      where: { email }
    });
    if (existsEmail) { throw new Error("400-이메일중복"); }

    // ERR 400 : 비밀번호 불일치
    if (password !== confirmPassword) { throw new Error("400-비밀번호불일치"); }

    // ERR 404 : 비밀번호 최소 길이 불충족 
    if (password.length < 6) { throw new Error("400-비밀번호길이"); };

    // 저장 : 비밀번호 암호화
    // await bcrypt.hash(비밀번호, 길이); : 비밀번호를 암호화
    const newPassword = await bcrypt.hash(password, 10);
    // 저장 : 회원정보
    const user = await prisma.USER.create({
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
    if (error.message === "400-아이디중복") {
      return res.status(400).json({ errorMessage: "이미 등록된 아이디입니다." });
    }
    else if (error.message === "400-이메일중복") {
      return res.status(400).json({ errorMessage: "이미 등록된 이메일입니다." });
    }
    else if (error.message === "400-비밀번호불일치") {
      return res.status(400).json({ errorMessage: "비밀번호와 비밀번호 확인에 입력한 값이 일치하지 않습니다." });
    }
    else if (error.message === "400-비밀번호길이") {
      return res.status(400).json({ errorMessage: "비밀번호는 6자 이상 입력해주세요." });
    } else {
      console.log(error);
    }
  }
});

// 로그인 및 인증정보 생성CREATE)
router.post("/login", async (req, res) => {
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
    if (!user) { throw new Error("400-아이디미존재"); }

    // 조회 : 암호화된 비밀번호
    const passwordValue = user[0].password;
    // bcrypt.compare(사용자가 로그인 시 입력한 비밀번호, DB에 저장된 암호화 비밀번호) : 
    const equalPassword = await bcrypt.compare(password, passwordValue);

    // ERR 404 : 비밀번호 불일치
    if (!equalPassword) { throw new Error("400-비밀번호불일치"); }

    // 로그인 성공 시 토큰 생성
    // jwt.sign({payload},"암호키",{expiresIn: 유효 시간}) : 토큰 생성
    const token = await jwt.sign({ login_id }, process.env.PRIVATE_KEY, { expiresIn: "12h" });
    res.cookie("Authorization", `Bearer ${token}`); // res.cookie("Authorization", `Bearer ${token}`) : 쿠키에 토큰 저장
    res.status(200).json({ token: token });
  } catch (error) {
    if (error.message === "400-아이디미존재") {
      res.status(400).json({ errorMessage: "아이디 또는 이메일이 존재하지 않습니다." });
    }
    else if (error.message === "400-비밀번호불일치") {
      res.status(400).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    } else {
      console.log(error);
    }
  }
});

// 내 정보 조회
router.get("/me", authMiddleware, async (req, res) => {
  // res.locals.@@ : localstorage에 저장된 정보 조회
  const { login_id, email, name } = res.locals.user;
  res.status(200).json({ myInfo: { login_id, name, email } });
});

module.exports = router;