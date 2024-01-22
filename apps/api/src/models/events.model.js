import { nanoid } from 'nanoid';
import { Model, DataTypes } from 'sequelize';

export default class events extends Model {
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
  events.init(
    {
      UUID: {
        type: DataTypes.STRING,
        defaultValue: nanoid(),
      },
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'events',
    },
  );
};
