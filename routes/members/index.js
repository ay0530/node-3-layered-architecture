
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
  // 아이디 검증
  // const exist_m_id = await Members.findOne({
  //   attributes: ["m_id"],
  //   where: { m_id }
  // });

  // if (exist_m_id) {
  //   res.status(400).json({ errorMessage: "ID가 이미 사용중입니다." });
  //   return;
  // }

  // 이메일 검증
  // const exist_m_email = await Members.findOne({
  //   attributes: ["m_email"],
  //   where: { m_email }
  // });

  // if (exist_m_email) {
  //   res.status(400).json({ errorMessage: "Email이 이미 사용중입니다." });
  //   return;
  // }

  // 비밀번호 검증
  // if (m_password.length < 6) {
  //   return res.status(400).json({ errorMessage: "비밀번호를 6자 이상 입력해주세요.", });
  // }

  if (m_password !== confirm_password) {
    return res.status(400).json({ errorMessage: "비밀번호와 비밀번호 확인에 입력한 값이 일치하지 않습니다.", });
  }

  const member = await Members.create({ m_id, m_password, m_name, m_email });
  await member.save();

  res.status(201).json({ member_info: { m_id, m_name, m_email } });
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

  const token = await jwt.sign({ m_id }, "lay-secret-key", { expiresIn: "12h" });
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