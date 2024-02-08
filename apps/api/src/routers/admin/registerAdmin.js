// import { createUser, findOneUser } from '../../controllers/user.controller';
// import { DB } from '../../db';
// import { hashPassword } from '../../helper/hash';

// export default async function registerAdmin(req, res, next) {
//     await DB.initialize();
//     const t = await DB.db.sequelize.transaction();
//     try {
//         const isExist = await findOneUser({
//             where: {
//                 email: req.body.email,
//             },
//         });
//         if (isExist) {
//             throw { rc: 400, message: 'Account already exist' };
//         }
//         const hashedPassword = await hashPassword(req.body.password, 10);
//         await createUser(
//             {
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: hashedPassword,
//                 role: 'admin',
//                 isVerified: true,
//             },
//             { transaction: t },
//         );
//         await t.commit();
//         return res.status(201).json({
//             rc: 201,
//             success: true,
//             message: 'Admin registered successfully',
//             result: null,
//         });
//     } catch (error) {
//         await t.rollback();
//         next(error);
//     }
// };