'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Products.init({
    p_num: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    m_num: DataTypes.INTEGER,
    p_name: {
      type: DataTypes.STRING,
    },
    p_description: {
      type: DataTypes.STRING,
    },
    p_status: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [["FOR_SALE", "SOLD_OUT"]],
          msg: "상품 상태를 제대로 입력해주세요."
        },
      }
    },
    p_created_at: DataTypes.DATE,
    p_updated_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Products',
  });
  return Products;
};