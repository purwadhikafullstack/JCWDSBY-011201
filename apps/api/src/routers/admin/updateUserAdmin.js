import { updateUser, findOneUser } from '../../controllers/user.controller';

export default async function updateUserAdmin(req, res, next) {
    try {
        const isExist = await findOneUser({
            where: {
                uuid: req.params.uuid
            },
        });
        if (!isExist) {
            throw { rc: 404, message: 'Account not found' };
        }
        const query = {
            where: {
                uuid: req.params.uuid
            }
        }
        await updateUser(req.body, query);
        return res.status(200).json({
            rc: 200,
            success: true,
            message: 'Profile updated successfully',
            result: null,
        });
    } catch (error) {
        next(error);
    }
};