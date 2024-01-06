'use strict';

import { Model, DataTypes } from 'sequelize';
import users from './users.model';
import cities from './cities.model';
import provinces from './provinces.model';
import districts from './districts.model';
import { nanoid } from 'nanoid';

export default class stores extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    stores.belongsTo(users, { foreignKey: 'userId' });
    stores.belongsTo(cities, { foreignKey: 'cityId' });
    stores.belongsTo(provinces, { foreignKey: 'provinceId' });
    stores.belongsTo(districts, { foreignKey: 'districtId' });
  }
}

export const init = (sequelize) => {
  stores.init(
    {
      UUID: {
        type: DataTypes.STRING,
        defaultValue: nanoid(),
      },
      name: DataTypes.STRING,
      postalCode: DataTypes.STRING,
      address: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      districtId: DataTypes.INTEGER,
      cityId: DataTypes.INTEGER,
      provinceId: DataTypes.INTEGER,
      lat: DataTypes.STRING,
      lon: DataTypes.STRING,
      isMain: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'stores',
      paranoid: true,
    },
  );
};
