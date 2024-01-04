import { Model, DataTypes } from 'sequelize';

export default class carts extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

export const init = (sequelize) => {
  carts.init({
    userId: DataTypes.INTEGER,
    inventoryId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    checked: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'carts',
  });
};
