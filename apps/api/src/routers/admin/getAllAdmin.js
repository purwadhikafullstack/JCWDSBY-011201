// import { findAllUser } from '../../controllers/user.controller';

// export default async function getAllAdmin(req, res, next) {
//   try {
//     const result = await findAllUser({
//       where: {
//         role: 'admin',
//       },
//       attributes: ['uuid', 'name', 'email'],
//     });
//     if (result) {
//       res.status(200).json(result);
//     }
//   } catch (error) {
//     next(error);
//   }
// }
