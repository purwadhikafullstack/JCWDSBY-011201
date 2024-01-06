'use strict';

import { Model, DataTypes } from 'sequelize';
import stores from './stores.model';
import user_addresses from './user-addresses.model';
import { nanoid } from 'nanoid';

export default class users extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    users.hasOne(stores, { foreignKey: 'userId' });
    users.hasMany(user_addresses, { foreignKey: 'userId' });
  }
}

export const init = (sequelize) => {
  users.init(
    {
      UUID: {
        type: DataTypes.STRING,
        defaultValue: nanoid(),
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      image: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'users',
    },
  );
};
