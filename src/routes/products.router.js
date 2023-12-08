import { Router } from "express"; // express 패키지
const productsRouter = Router();
import authMiddleware from '../middlewares/auth.middleware.js'; // 인증 미들웨어 조회
import productValidate from '../validator/products.validator.js'; // vaild 에러
import ProdcutController from '../controllers/products.controller.js'; // 컨트롤러
const productsController = new ProdcutController();

// // 상품 정보 저장
productsRouter.post("/", authMiddleware, productValidate, productsController.createProduct);

// //  상품 정보 수정
productsRouter.put("/:id", authMiddleware, productValidate, productsController.updateProduct);

// //  상품 정보 삭제
productsRouter.delete("/:id", authMiddleware, productsController.deleteProduct);

// //  상품 정보 전체 조회
productsRouter.get("/", productsController.getProducts);

// //  상품 상세 조회
productsRouter.get("/:id", productsController.getProduct);

export default productsRouter; // router 내보내기