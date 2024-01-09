import { findOneUser } from "../../controllers/user.controller";

export default async function getAdminDetail(req, res, next) {
    try {
        const result = await findOneUser({
            where: {
                uuid: req.params.uuid,
            },
            attributes: ['uuid', 'name', 'email'],
        });
        if (result){
            res.status(200).json(result);
        }
    } catch (error) {
        next(error);
    }
};