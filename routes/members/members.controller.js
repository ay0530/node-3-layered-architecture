const express = require("express"); // express 받아오기
const router = express.Router(); // router 받아오기
const Members = require("../../models/members");

// 회원정보 저장(CREATE)
exports.create_member = async (req, res) => {
  const { m_id, m_password, confirm_password, m_name, m_email } = req.body;
  // 비밀번호 검증
  if (m_password.length < 6) {
    return res.status(400).json({ errorMessage: "비밀번호를 6글자 이상 입력해주세요.", });
  }

  if (m_password !== confirm_password) {
    return res.status(400).json({ errorMessage: "비밀번호와 비밀번호 확인에 입력한 값이 일치하지 않습니다.", });
  }

  // 아이디 검증
  const exist_m_id = await Members.findOne({
    attributes: ["m_id"],
    where: { m_id }
  });

  if (exist_m_id) {
    res.status(400).json({ errorMessage: "ID가 이미 사용중입니다." });
    return;
  }

  // 이메일 검증
  const exist_m_email = await Members.findOne({
    attributes: ["m_email"],
    where: { m_email }
  });

  if (exist_m_email) {
    res.status(400).json({ errorMessage: "Email이 이미 사용중입니다." });
    return;
  }

  const member = await Members.create({ m_id, m_password, m_name, m_email });
  await member.save();

  res.status(201).json({ data: member });
};

module.exports = router;