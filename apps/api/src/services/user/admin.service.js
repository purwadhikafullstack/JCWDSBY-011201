import { Op } from 'sequelize';
import { DB } from '../../db';
import { hashPassword } from '../../helper/hash';
import resTemplate from '../../helper/resTemplate';
import stores from '../../models/stores.model';
import users from "../../models/users.model";

export const getAdminService = async (queryParam) => {
  try {
    const limit = queryParam.limit ?? 'none';
    const page = queryParam.page ?? 1;

    const params = {
      where: {
        role: 'admin',
      },
      limit: parseInt(limit),
      offset: page * parseInt(limit) - parseInt(limit),
      attributes: ['uuid', 'name', 'email'],
    }

    if (limit === 'none') {
      delete params.limit;
      delete params.offset;
    }

    const result = await users.findAndCountAll(params);

    if (limit !== 'none') result.totalPage = Math.ceil(result.count / limit);

    return result
  } catch (error) {
    throw error;
  }
};

export const getAdminDetailService = async (uuid) => {
  try {
    const result = await users.findOne({
      where: { uuid },
      attributes: ['uuid', 'name', 'email'],
    });
    return result
  } catch (error) {
    throw error;
  }
};

export const registerAdminService = async (data) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const isExist = await users.findOne({
      where: {
        email: data.email,
      },
    });
    if (isExist) throw resTemplate(400, false, 'Account already exist')

    const hashedPassword = await hashPassword(data.password, 10);
    const result = await users.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
    },
      { transaction: t });

    await t.commit();
    return result
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const updateAdminService = async (data, uuid) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const isExist = await users.findOne({
      where: { uuid },
    }, {transaction: t});
    if (!isExist) throw resTemplate(404, false, 'Account not found')
      
    const result = await users.update(data, {
      where: { uuid },
      transaction: t,
    });

    await t.commit();
    return result
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const changePasswordAdminService = async (data, uuid) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const isExist = await users.findOne({
      where: { uuid },
    }, {transaction: t});
    if (!isExist) throw resTemplate(404, false, 'Account not found')
    
    const hashedPassword = await hashPassword(data.password, 10);

    const result = await users.update({ password: hashedPassword }, {
      where: { uuid },
      transaction: t,
    });

    await t.commit();
    return result
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const deleteAdminService = async (uuid) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const isExist = await users.findOne({
      where: { uuid },
    }, {transaction: t});
    if (!isExist) throw resTemplate(404, false, 'Account not found')

    const result = await users.destroy({
      where: { uuid }
    }, {transaction: t});

    await t.commit();
    return result
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const findOneAdminByUsernameService = async (username) => {
  const result = await users.findOne({
    include: {
      model: stores,
      required: false,
    },
    where: {
      [Op.and]: [
        { email: username },
        { [Op.or]: [{ role: 'admin' }, { role: 'super' }] },
      ],
    },
  });
  return result;
};

export const findOneAdminByUUIDService = async (UUID) => {
  const result = await users.findOne({
    where: {
      UUID: UUID,
    },
  });
  return result;
};