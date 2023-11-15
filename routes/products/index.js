const express = require("express"); // express 받아오기
const router = express.Router(); // router 받아오기
const { Products } = require("../../models/index");

// // 1. 상품 작성 API (Create / POST)
router.post("/", async (req, res) => {
  try {
    // body 값 조회
    const { p_name, p_description } = req.body;

    // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
    if (!p_name || !p_description) {
      throw new Error("400-데이터입력err");
    }

    // 저장(CREATE)
    await Products.create({ p_name, p_description });
    res.status(201).json({ message: "판매 상품을 등록하였습니다." });
  } catch (error) {
    if (error.message === "400-데이터입력err") {
      return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
  }
});

// //  2. 상품 목록 조회 API (Read / GET)
router.get("/", async (req, res) => {
  console.log(req.query);
  const { category, order } = req.query;

  // 모든 상품 조회
  const allProduct = await Products.findAll({
    attributes: ['p_num', 'p_name', 'p_description', 'm_num', 'p_status', 'p_created_at'],
    order: [[category, order]]
  });
  // 조회 (READ)
  return res.status(200).json({ allProduct });
});

// //  3. 상품 상세 조회 API (Read / GET)
router.get("/:p_num", async (req, res) => {
  try {
    const { p_num } = req.params; // params 값 조회

    const product = await Products.findOne({ where: { p_num } });

    // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
    if (!product) {
      throw new Error("404-상품미저장err");
    }

    res.status(200).json({ detail: product });
  } catch (error) {
    if (error.message === "404-상품미저장err") {
      return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
    }
  }
});

module.exports = router; // router 내보내기