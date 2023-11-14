'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Members extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Members.init({
    m_num: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    }
    ,
    m_id: DataTypes.STRING,
    m_password: DataTypes.STRING,
    m_name: DataTypes.STRING,
    m_email: DataTypes.STRING,
    m_created_at: DataTypes.DATE,
    m_updated_at: DataTypes.DATE
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Members',
  });
  return Members;
};