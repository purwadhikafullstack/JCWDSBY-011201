// import users from '../models/users.model';

// export const getAllUser = async () => {
//     return await users.findAll({
//         where: {
//             role: 'user'
//         },
//         attributes: ['name', 'email', 'isVerified']
//     });
// };

// export const addAdmin = async (req, res, next) => {
//     return await users.create({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password,
//         role: 'admin',
//         type: 'regular',
//         isVerified: true,
//     });
// };