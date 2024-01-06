import { findOneCity } from '../../controllers/city.controller';
import { findOneDistrict } from '../../controllers/district.controller';
import { findOneProvince } from '../../controllers/province.controller';
import { createStore, findOneStore } from '../../controllers/store.controller';
import { findOneUser } from '../../controllers/user.controller';
import { DB } from '../../db';
import geocode from '../../helper/geocode';

export default async function (req, res, next) {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const district = await findOneDistrict({ id: req.body.district });
    const city = await findOneCity({ id: req.body.city });
    const province = await findOneProvince({ id: req.body.province });
    const latLon = await geocode(
      district.dataValues.districtName,
      city.dataValues.cityName,
      province.dataValues.provinceName,
    );
    if (!latLon) {
      throw { rc: 404, message: 'Address for store not found' };
    }
    const user = await findOneUser({ where: { UUID: req.body.user } });
    if (!user) {
      throw { rc: 404, message: 'User not found' };
    }
    const data = {
      name: req.body.storeName,
      userId: user.dataValues.id,
      address: req.body.address,
      postalCode: req.body.postalCode,
      districtId: req.body.district,
      cityId: req.body.city,
      provinceId: req.body.province,
      lat: latLon.lat,
      lon: latLon.lng,
    };
    const isExist = await findOneStore({
      where: {
        isMain: true,
      },
    });
    if (!isExist) {
      data.isMain = true;
    }
    const result = await createStore(data, { transaction: t });
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success add store',
      result: null,
    });
  } catch (error) {
    await t.rollback();
    return res.status(error.rc || 500).json({
      rc: error.rc || 500,
      success: false,
      message: error.message,
      result: null,
    });
  }
}
