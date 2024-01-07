import { findOneStore } from '../../controllers/store.controller';

export default async function (req, res, next) {
  try {
    const result = await findOneStore({
      where: {
        UUID: req.params.id,
      },
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'],
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
