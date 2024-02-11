import { DB } from '../../db';
import resTemplate from '../../helper/resTemplate';
import {
  findDefaultUserAddressService,
  updateUserAddressService,
} from '../../services/address/address.service';

const updateDefaultAddress = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const currDefault = await findDefaultUserAddressService(req.tokenData.id);
    if (currDefault) {
      await updateUserAddressService(
        { isDefault: false },
        currDefault.dataValues.UUID,
        t,
      );
    }

    const result = await updateUserAddressService(
      { isDefault: true },
      req.params.id,
      t,
    );

    if (!result[0]) {
      throw { rc: 404, message: 'Address not found' };
    }
    await t.commit();
    return res
      .status(201)
      .json(resTemplate(201, true, 'Success change default address', null));
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default updateDefaultAddress;
