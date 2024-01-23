import { Model, DataTypes } from 'sequelize';

export default class transactionDetails extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    transactionDetails.belongsTo(models.transactions, {
      foreignKey: 'transactionId',
    });
  }
}

export const init = (sequelize) => {
  transactionDetails.init(
    {
      transactionId: DataTypes.INTEGER,
      inventoryId: DataTypes.INTEGER,
      discountId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'transactionDetails',
    },
  );
};
