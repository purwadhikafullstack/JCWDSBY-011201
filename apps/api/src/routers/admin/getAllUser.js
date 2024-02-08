import { findAllUser } from '../../controllers/user.controller';
import { findAllUserService } from '../../services/user/user.service';

export default async function getAllUser(req, res, next) {
  try {
    const result = await findAllUserService();
    if (result) {
      res.status(200).json(result);
    }
  } catch (error) {
    next(error);
  }
}
