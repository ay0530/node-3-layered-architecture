const express = require("express"); // express 받아오기
const router = express.Router(); // router 받아오기

// const Product = require("../schemas/products.schema.js"); // 스키마 받아오기

// // 1. 상품 작성 API (Create / POST)
router.post("/:productId", async (req, res) => {
  try {
    // body 값 조회
    const { productId } = req.params;
    const { productName, productDescription, productStatus, sellerId, sellerPw, registrationDate } = req.body;

    // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
    if (!productName || !productDescription || !sellerId || !sellerPw) {
      throw new Error("400-데이터입력err");
    }

    // ERR 400 : DB에 해당 상품 Id 값이 존재할 경우
    const existsProduct = await Product.findOne({ productId });
    if (existsProduct) {
      throw new Error("400-아이디중복err");
    }

    // 저장(CREATE)
    await Product.create({ productId, productName, productDescription, productStatus, sellerId, sellerPw, registrationDate });
    res.status(201).json({ message: "판매 상품을 등록하였습니다." });
  } catch (error) {
    if (error.message === "400-데이터입력err") {
      return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    } else if (error.message === "400-아이디중복err") {
      return res.status(400).json({ errorMessage: "상품 ID가 존재합니다. 다른 ID를 입력해주세요." });
    }
  }
});

// ERR 400 : params를 입력하지 않은 경우
router.post("/product/", async (req, res) => {
  res.status(400).json({ errorMessage: "상품 ID를 입력해주세요." });
});


// //  2. 상품 목록 조회 API (Read / GET)
router.get("/", async (req, res) => {
  // 모든 상품 조회
  const allProduct = await Product.find({}, { productId: 1, productName: 1, productDescription: 1, productStatus: 1, registrationDate: 1 })
    .sort({ createdAt: -1 });

  // 조회 (READ)
  return res.status(200).json({ allProduct });
});

// //  3. 상품 상세 조회 API (Read / GET)
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params; // params 값 조회

    // ERR 400 : 검색어가 없는 경우
    if (!productId) {
      throw new Error("400-검색어err");
    }

    // 전체 상품 조회
    const allProduct = await Product.find(
      {},
      {
        productId: 1,
        productName: 1,
        productDescription: 1,
        sellerId: 1,
        productStatus: 1,
        registrationDate: 1
      }
    );

    // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
    const [result] = allProduct.filter((product) => Number(productId) === product.productId);
    if (!result) {
      throw new Error("404-상품미저장err");
    }

    // 조회 (READ)
    res.status(200).json({ detail: result });
  } catch (error) {
    if (error.message === "400-검색어err") {
      return res.status(400).json({ errorMessage: "검색어가 존재하지 않습니다." });
    } else if (error.message === "404-상품미저장err") {
      return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
    }
  }
});

// ERR 400 : params를 입력하지 않은 경우
router.get("/product/", async (req, res) => {
  res.status(400).json({ errorMessage: "상품 ID를 입력해주세요." });
});

// //  4. 상품 정보 수정 API (Update / PUT)
router.put("/product/:productId", async (req, res) => {
  try {
    // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
    if (!req.params.productId) {
      throw new Error("400-데이터입력err");
    }

    const productId = req.params.productId; // params 값 조회
    console.log(productId);

    const { productDescription, productStatus, sellerPw } = req.body; // body 값 조회

    // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
    const existsProduct = await Product.findOne({ productId });
    if (!existsProduct) {
      throw new Error("404-상품미저장err");
    }

    // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
    if (!productId || !productDescription || !productStatus || !sellerPw) {
      throw new Error("400-데이터입력err");
    }

    // ERR 400 : 상품 상태가 FOR_SALE, SOLD_OUT이 아닌 경우
    if (productStatus != "FOR_SALE" && productStatus != "SOLD_OUT") {
      throw new Error("400-상품상태err");
    }

    // ERR 403 : 비밀번호 불일치 
    const selectData = await Product.findOne({ productId: productId }, { sellerPw: 1 });
    const selectPw = selectData.sellerPw;
    if (sellerPw !== selectPw) {
      throw new Error("403-비밀번호err");
    }

    // 수정(UPDATE)
    await Product.updateOne(
      { productId: productId },
      {
        $set: {
          productDescription: productDescription,
          productStatus: productStatus
        }
      }
    );

    res.status(200).json({ message: "상품 정보를 수정하였습니다." });
  } catch (error) {
    // 오류를 클라이언트에게 반환
    if (error.message === "400-데이터입력err") {
      res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    } else if (error.message === "400-상품상태err") {
      res.status(400).json({ errorMessage: "상품 상태가 올바르지 않습니다." });
    } else if (error.message === "403-비밀번호err") {
      res.status(403).json({ errorMessage: "상품을 수정할 권한이 존재하지 않습니다." });
    } else if (error.message === "404-상품미저장err") {
      res.status(404).json({ errorMessage: "상품 조회에 실패하였습니다." });
    }
  }
});

// ERR 400 : params를 입력하지 않은 경우
router.put("/product/", async (req, res) => {
  res.status(400).json({ errorMessage: "상품 ID를 입력해주세요." });
});

// //  5. 상품 삭제 API (Delete / DELETE)
router.delete("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params; // params 값 조회
    const { sellerPw } = req.body; // body 값 조회

    // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
    const existsProduct = await Product.find({ productId });
    if (!existsProduct) {
      throw new Error("404-상품미저장err");
    }

    // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
    if (!productId || !sellerPw) {
      throw new Error("400-데이터입력err");
    }

    // ERR 401 : 비밀번호 불일치 
    const selectData = await Product.findOne({ productId: productId }, { sellerPw: 1 });
    const selectPw = selectData.sellerPw;
    if (sellerPw != selectPw) {
      throw new Error("403-비밀번호err");
    }

    // 삭제(DELETE)
    await Product.deleteOne({ productId });
    res.status(200).json({ message: "상품을 삭제하였습니다." });
  } catch (error) {
    if (error.message === "400-데이터입력err") {
      res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    } else if (error.message === "403-비밀번호err") {
      res.status(400).json({ errorMessage: "상품을 수정할 권한이 존재하지 않습니다" });
    } else if (error.message === "404-상품미저장err") {
      res.status(403).json({ errorMessage: "상품 조회에 실패하였습니다." });
    }
  }
});

// ERR 400 : params를 입력하지 않은 경우
router.delete("/product/", async (req, res) => {
  res.status(400).json({ errorMessage: "상품 ID를 입력해주세요." });
});

module.exports = router; // router 내보내기