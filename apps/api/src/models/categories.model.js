import { Model, DataTypes } from 'sequelize';

export default class categories extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    categories.hasMany(models.product);
  }
}

export const init = (sequelize) => {
  categories.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'categories',
      paranoid: true,
    }
  );
};
