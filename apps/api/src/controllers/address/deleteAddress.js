import { DB } from '../../db';
import resTemplate from '../../helper/resTemplate';
import { deleteUserAddressService } from '../../services/address/address.service';

const deleteAddress = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const result = await deleteUserAddressService(req.params.id, t);
    if (!result) {
      throw {
        rc: 404,
        message: 'Address not found or cannot delete default address',
      };
    }
    await t.commit();
    return res
      .status(201)
      .json(resTemplate(201, true, 'Success delete address', null));
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default deleteAddress;
