// src/services/posts.service.js

import ProductRepository from '../repositories/products.repositories.js';

class ProductService {
  productsRepository = new ProductRepository();

  // 회원 번호 조회
  getUserId = async (login_id) => {
    const userId = await this.productsRepository.getUserId(login_id);
    return userId.id;
  };

  // 상품 저장
  createProduct = async (userId, name, description) => {
    const createdPost = await this.productsRepository.createProduct(userId, name, description);

    return createdPost;
  };

  // 상품 전체 조회
  getProducts = async () => {
    const products = await this.productsRepository.getProducts();
    return products;
  };

  // 상품 상세 조회
  getProduct = async (id) => {
    const product = await this.productsRepository.getProduct(id);
    return product;
  };

  // 상품 수정
  updateProduct = async (id, name, description, status) => {
    await this.productsRepository.updateProduct(id, name, description, status);
  };

  // 상품 삭제
  deleteProduct = async (id) => {
    await this.postsRepository.deletePost(id);
  };
}

export default ProductService;