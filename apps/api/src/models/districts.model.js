import { Model, DataTypes } from 'sequelize';
import user_addresses from './user-addresses.model';
import stores from './stores.model';
import cities from './cities.model';

export default class districts extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    districts.belongsTo(cities, { foreignKey: 'cityId' });
    districts.hasMany(user_addresses, { foreignKey: 'districtId' });
    districts.hasMany(stores, { foreignKey: 'districtId' });
  }
}

export const init = (sequelize) => {
  districts.init(
    {
      cityId: DataTypes.INTEGER,
      districtName: DataTypes.STRING,
      lat: DataTypes.STRING,
      lon: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'districts',
    },
  );
};
