import { findOneStore } from '../../controllers/store.controller';
import users from '../../models/users.model';

export default async function (req, res, next) {
  try {
    const result = await findOneStore({
      where: {
        UUID: req.params.id,
      },
      include: [
        {
          model: users,
          attributes: ['UUID'],
        },
      ],
      attributes: {
        exclude: ['id', 'createdAt', 'userId', 'updatedAt', 'deletedAt'],
      },
    });

    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success get store detail',
      result: result,
    });
  } catch (error) {
    return res.status(error.rc || 500).json({
      rc: error.rc || 500,
      success: false,
      message: error.message,
      result: null,
    });
  }
}
