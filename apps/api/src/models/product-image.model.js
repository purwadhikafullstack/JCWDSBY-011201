import { Model, DataTypes } from 'sequelize';

export default class product_image extends Model {
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
  product_image.init(
    {
      productId: DataTypes.INTEGER,
      image: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'product_image',
      paranoid: true,
    }
  );
};
