
import { validationResult } from 'express-validator'; // express 유효성 검사 패키지
import { ProductsValidError } from '../error-handlers/custom.errors.js'; // custom 에러
import ProductsService from '../services/products.services.js'; // 서비스

class ProductsController {
  // 
  productsService = new ProductsService();

  // // 상품 정보 저장
  createProduct = async (req, res, next) => {
    // validationResult : express-validator 유효성 검사 실행
    const errors = validationResult(req);
    try {
      const { name, description } = req.body; // body 값 조회
      const { login_id } = res.locals.user; // localstroage 값 조회 

      // ERR 400 : 필수 값들이 입력되지 않은 경우
      if (!errors.isEmpty()) {
        throw new ProductsValidError();
      }

      // 조회 : 상품 정보
      const product = await this.productsService.createProduct(login_id, name, description);

      // response 반환
      res.status(201).json({ message: "상품 등록이 완료되었습니다.", data: product });
    } catch (error) {
      next(error);
    }
  };

  // //  상품 정보 전체 조회
  getProducts = async (req, res, next) => {
    try {
      const { category, order } = req.query; // req 조회
      const orderBy = {}; // 정렬 필드 객체 생성
      orderBy[category] = order === 'desc' ? 'desc' : 'asc';

      // 조회 : 모든 상품 정보 
      const products = await this.productsService.getProducts(orderBy);

      // response 반환
      return res.status(200).json({ message: "전체 상품을 조회하였습니다.", data: products });
    } catch (error) {
      next(error);
    }

  };

  // //  상품 상세 조회
  getProduct = async (req, res, next) => {
    try {
      const { id } = req.params; // params 값 조회

      // 조회 : 모든 상품 정보 
      const product = await this.productsService.getProduct(id);

      // response 반환
      res.status(200).json({ message: "상품 상세 정보를 조회하였습니다.", data: product });
    } catch (error) {
      next(error);
    }
  };

  // //  상품 정보 수정
  updateProduct = async (req, res, next) => {
    // validationResult : express-validator 유효성 검사 실행
    const errors = validationResult(req);
    try {
      const { id } = req.params; // params 값 조회
      const { name, description, status } = req.body; // body 값 조회
      const { login_id } = res.locals.user; // localstroage 값 조회 

      // ERR 400 : 필수 값들이 입력되지 않은 경우
      if (!errors.isEmpty()) {
        throw new ProductsValidError();
      }

      // 조회 : 상품 정보
      const product = await this.productsService.updateProduct(login_id, id, name, description, status);

      // response 반환
      res.status(200).json({ message: "상품 수정이 완료되었습니다.", data: product });
    } catch (error) {
      next(error);
    }
  };

  // //  상품 정보 삭제
  deleteProduct = async (req, res, next) => {
    try {
      const { id } = req.params; // params 값 조회
      const { login_id } = res.locals.user; // localstroage 값 조회 

      // 삭제 : 상품 정보
      await this.productsService.deleteProduct(login_id, id);

      // response 반환
      res.status(200).json({ message: "상품을 삭제하였습니다." });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductsController;  // router 내보내기