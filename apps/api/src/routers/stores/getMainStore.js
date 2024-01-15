import { Op } from 'sequelize';
import { findAllStores, findOneStore } from '../../controllers/store.controller';
import cities from '../../models/cities.model';
import districts from '../../models/districts.model';
import provinces from '../../models/provinces.model';
import users from '../../models/users.model';
import resTemplate from '../../helper/resTemplate';

export default async function (req, res, next) {
    try {
        const result = await findOneStore({
            where: { isMain: true },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
            include: [
                { model: users, attributes: ['name'] },
                { model: districts, attributes: ['districtName'] },
                { model: cities, attributes: ['cityName'] },
                { model: provinces, attributes: ['provinceName'] },
            ],
        });

        return res.status(200).json(resTemplate(200, true, 'Success get main store', result))
    } catch (error) {
        next(error);
    }
};