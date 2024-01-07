import { findOneCity } from '../../controllers/city.controller';
import { findOneDistrict } from '../../controllers/district.controller';
import { findOneProvince } from '../../controllers/province.controller';
import { updateStore } from '../../controllers/store.controller';
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
      throw { rc: 404, message: 'Address not found' };
    }
    const data = {
      address: req.body.address,
      districtId: req.body.district,
      cityId: req.body.city,
      provinceId: req.body.province,
      postalCode: req.body.postalCode,
      userId: req.body.user,
      lat: latLon.lat,
      lon: latLon.lng,
    };
    const result = await updateStore(data, {
      where: { UUID: req.params.id },
      transaction: t,
    });

    if (!result[0]) {
      throw { rc: 404, message: 'Store not found' };
    }
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success edit store',
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
