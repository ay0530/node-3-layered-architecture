
// 일단 index.js에서 api 구현하기
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { Members } = require("../../models/index");
const auth_middleware = require("../../middlewares/auth-middleware.js");

// 회원 정보 저장(CREATE)
router.post('/sign', async (req, res) => {
  const { m_id, m_password, confirm_password, m_name, m_email } = req.body;
  try {
    // 아이디 조회
    const exists_m_id = await Members.findOne({ where: { m_id: m_id } });
    if (exists_m_id) {
      return res.status(400).json({ errorMessage: "이미 존재하는 아이디입니다." });
    }
    // 이메일 조회
    const exists_m_email = await Members.findOne({ where: { m_id: m_id } });
    if (exists_m_email) {
      return res.status(400).json({ errorMessage: "이미 존재하는 이메일입니다." });
    }

    // 비밀번호 일치 여부
    if (m_password !== confirm_password) {
      return res.status(400).json({ errorMessage: "비밀번호와 비밀번호 확인에 입력한 값이 일치하지 않습니다.", });
    }

    // 비밀번호 길이
    if (m_password.length < 6) {
      return res.status(400).json({ errorMessage: "비밀번호는 6자 이상 입력해주세요." });
    };

    // 비밀번호 암호화
    const new_m_password = await bcrypt.hash(m_password, 10);
    // 회원 정보 저장
    const member = await Members.create({ m_id, m_password: new_m_password, m_name, m_email });
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

  if (!member) {
    res.status(400).json({ errorMessage: "아이디 또는 이메일이 존재하지 않습니다." });
    return;
  }

  const m_password_value = member.get("m_password");
  console.log('m_password_value: ', m_password_value);
  const equal_m_password = await bcrypt.compare(m_password, m_password_value);
  console.log('equal_m_password: ', equal_m_password);

  if (!equal_m_password) {
    res.status(400).json({
      errorMessage: "비밀번호가 일치하지 않습니다."
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