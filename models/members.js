'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Members extends Model {
    static associate(models) {
      // define association here
    }
  }
  Members.init({
    m_num: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    m_id: {
      type: DataTypes.STRING,
    },
    m_password: {
      type: DataTypes.STRING,
    },
    m_name: DataTypes.STRING,
    m_email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "이메일 형식을 제대로 입력해주세요."
        }
      }
    },
    m_created_at: DataTypes.DATE,
    m_updated_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Members'
  });
  return Members;
};