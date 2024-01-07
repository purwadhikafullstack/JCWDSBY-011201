import { updateUser, findOneUser } from '../../controllers/user.controller';
import { hashPassword } from '../../helper/hash';

export default async function changePasswordAdmin(req, res, next) {
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
        const hashedPassword = await hashPassword(req.body.password, 10);
        await updateUser({ password: hashedPassword }, query);
        return res.status(200).json({
            rc: 200,
            success: true,
            message: 'Password changed successfully',
            result: null,
        });
    } catch (error) {
        next(error);
    }
};