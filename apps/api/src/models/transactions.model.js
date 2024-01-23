import { Model, DataTypes } from 'sequelize';

export default class transactions extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    transactions.hasMany(models.transactionDetails, {
      foreignKey: 'transactionId',
    });
    // define association here
  }
}

export const init = (sequelize) => {
  transactions.init(
    {
      userId: DataTypes.INTEGER,
      invoice: DataTypes.STRING,
      transactionDate: DataTypes.STRING,
      shipmentTotal: DataTypes.INTEGER,
      paymentMethod: DataTypes.STRING,
      paymentProofImg: DataTypes.STRING,
      userAddressId: DataTypes.INTEGER,
      paymentTotal: DataTypes.INTEGER,
      paymentStatus: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'transactions',
    },
  );
};
