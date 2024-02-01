import { Model, DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';

export default class discount extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    // Transaction Detail
    // discount.hasMany(models.transactionDetail)
    discount.belongsTo(models.stores)
    discount.belongsTo(models.inventory)
  }
};

export const init = (sequelize) => {
  discount.init({
    UUID: {
      type: DataTypes.STRING,
      defaultValue: nanoid(),
    },
    storeId: DataTypes.INTEGER,
    inventoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    limit: DataTypes.INTEGER,
    term: DataTypes.ENUM(['buy 1 get 1', 'product', 'min transaction']),
    type: DataTypes.ENUM(['nominal', 'percentage']),
    minTransaction: DataTypes.INTEGER,
    nominal: DataTypes.INTEGER,
    percentage: DataTypes.DECIMAL(4,1),
    voucherCode: DataTypes.STRING,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'discount',
    paranoid: true,
  });
};
