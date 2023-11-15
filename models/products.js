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
    p_name: DataTypes.STRING,
    p_description: DataTypes.STRING,
    p_status: DataTypes.STRING,
    p_created_at: DataTypes.DATE,
    p_updated_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Products',
  });
  return Products;
};