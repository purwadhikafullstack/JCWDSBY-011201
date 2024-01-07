import { findAllUser } from "../../controllers/user.controller";

export default async function getAllUser(req, res, next) {
    try {
        const result = await findAllUser({
            where: {
                role: 'user',
            },
            attributes: ['name', 'email', 'isVerified'],
        });
        if (result){
            res.status(200).json(result);
        }
    } catch (error) {
        next(error);
    }
};