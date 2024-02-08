// import { deleteUser, findOneUser } from "../../controllers/user.controller";

// export default async function deleteAdmin(req, res, next) {
//     try {
//         const isExist = await findOneUser({
//             where: {
//                 uuid: req.params.uuid
//             },
//         });
//         if (!isExist) {
//             throw { rc: 404, message: 'Account not found' };
//         }
//         await deleteUser({
//             where: {
//                 uuid: req.params.uuid
//             }
//         });
//         return res.status(200).json({
//             rc: 200,
//             success: true,
//             message: 'Admin account deleted successfully',
//             result: null,
//         });
//     } catch (error) {
//         next(error);
//     }
// };