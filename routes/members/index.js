
// 일단 index.js에서 api 구현하기
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Members } = require("../../models/index");
const auth_middleware = require("../../middlewares/auth-middleware.js");

// 회원 정보 저장(CREATE)
router.post('/sign', async (req, res) => {
  const { m_id, m_password, confirm_password, m_name, m_email } = req.body;
  try {
    if (m_password !== confirm_password) {
      return res.status(400).json({ errorMessage: "비밀번호와 비밀번호 확인에 입력한 값이 일치하지 않습니다.", });
    }
    // 비밀번호 암호화
    // const originPassword = m_password;
    // const saltRounds = 10;
    // const hashPassword = bcrypt.hash(originPassword, saltRounds, (err, hash) => {
    //   console.log("hash");
    //   if (err) {
    //     // 에러 처리
    //     console.error(err);
    //     return;
    //   }
    //   return hash;
    // });
    const member = await Members.create({ m_id, m_password, m_name, m_email });
    await member.save();

    res.status(201).json({ member_info: { m_id, m_name, m_email } });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message.replace('Validation error: ', ''));
      return res.status(400).json({ errorMessage: validationErrors });
    }
  }
});

// 로그인 및 인증정보 생성CREATE)
router.post("/login", async (req, res) => {
  const { m_id, m_password } = req.body;

  const member = await Members.findOne({
    where: {
      [Op.or]: [
        { m_id: m_id },
        { m_email: m_id }
      ]
    }
  });

  if (!member || m_password !== member.m_password) {
    res.status(400).json({
      errorMessage: "사용자가 존재하지 않거나, 사용자의 password와 입력받은 password가 일치하지 않습니다."
    });
    return;
  }

  const token = await jwt.sign({ m_id }, "lay-secret-key", { expiresIn: "10m" });
  res.cookie("Authorization", `Bearer ${token}`);
  res.status(200).json({ token: token });
});

// 내 정보 조회
router.get("/me", auth_middleware, async (req, res) => {
  const { m_id, m_email, m_name } = res.locals.member;

  res.status(200).json({
    user: { m_id, m_name, m_email }
  });
});

module.exports = router;