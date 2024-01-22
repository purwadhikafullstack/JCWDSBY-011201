import { Model, DataTypes } from 'sequelize';

export default class sample extends Model {
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
  sample.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'sample',
    },
  );
};
