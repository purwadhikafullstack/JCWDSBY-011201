'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      invoice: {
        type: Sequelize.STRING
      },
      transactionDate: {
        type: Sequelize.DATE
      },
      shipmentTotal: {
        type: Sequelize.INTEGER
      },
      paymentMethod: {
        type: Sequelize.STRING
      },
      paymentProofImg: {
        type: Sequelize.STRING
      },
      userAddressId: {
        type: Sequelize.INTEGER
      },
      paymentTotal: {
        type: Sequelize.INTEGER
      },
      paymentStatus: {
        type: Sequelize.STRING,
        defaultValue:'pending'
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
    await queryInterface.dropTable('transactions');
  }
};