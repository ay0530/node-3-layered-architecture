'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      p_num: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      m_num: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      p_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      p_description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      p_status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "FOR_SALE",
      },
      p_created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now")
      },
      p_updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now")
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};