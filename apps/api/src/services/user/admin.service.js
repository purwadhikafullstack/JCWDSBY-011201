import { Op } from 'sequelize';
import stores from '../../models/stores.model';
import users from '../../models/users.model';

class AdminServiceClass {
  async findOneAdminByUsername(username) {
    try {
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
      return { success: true, result: result };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }
}

const adminService = new AdminServiceClass();

export default adminService;
