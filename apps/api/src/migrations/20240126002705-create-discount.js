'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('discounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UUID: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      storeId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      inventoryId: {
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      term: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['buy 1 get 1', 'product', 'min transaction']
      },
      type: {
        type: Sequelize.ENUM,
        values: ['nominal', 'percentage']
      },
      limit: {
        type: Sequelize.INTEGER
      },
      minTransaction: {
        type: Sequelize.INTEGER
      },
      nominal: {
        type: Sequelize.INTEGER
      },
      percentage: {
        type: Sequelize.DECIMAL(4,1)
      },
      voucherCode: {
        unique: true,
        type: Sequelize.STRING
      },
      startTime: {
        type: Sequelize.DATE
      },
      endTime: {
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('discounts');
  }
};