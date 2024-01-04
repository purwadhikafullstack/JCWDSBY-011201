import {
  findAllUserAddress,
  findOneUserAddress,
} from '../../controllers/address.controller';

export default async function (req, res, next) {
  try {
    const result = await findOneUserAddress({
      where: {
        userId: req.tokenData.id,
        UUID: req.params.id,
      },
      attributes: {
        exclude: ['id', 'userId', 'createdAt', 'updatedAt', 'deletedAt'],
      },
    });

    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success get all address',
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
