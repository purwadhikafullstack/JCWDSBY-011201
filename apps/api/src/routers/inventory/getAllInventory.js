import { findAllInventory, findAndCountAllInventory } from "../../controllers/inventory.controller";
import { Op, col, literal } from 'sequelize';
import resTemplate from "../../helper/resTemplate";
import product from "../../models/product.model";
import categories from "../../models/categories.model";
import productImage from "../../models/product-image.model";
import store from "../../models/stores.model";
import users from "../../models/users.model";
import discount from "../../models/discount.model";

export default async function (req, res, next) {
	try {
		const query = req.query.q ?? '';
		const category = req.query.category ?? '';
		const sort = req.query.sort ?? 'none';
		const email = req.query.admin ?? '';
		const storeUUID = req.query.store ?? '';
		const page = req.query.page ?? 1;
		const limit = req.query.limit ?? 5;
		let order = [];

		if (sort === 'lowest') order.push(col('productPrice'), 'ASC');
		if (sort === 'highest') order.push(col('productPrice'), 'DESC');
		if (sort === 'lowestStock') order.push('stock', 'ASC');
		if (sort === 'highestStock') order.push('stock', 'DESC');
		if (sort === 'nameasc' || sort === 'none') order.push(col('productName'), 'ASC');
		if (sort === 'namedesc') order.push(col('productName'), 'DESC');

		const params = {
			include: [
				{
					model: product,
					required: true,
					where: { name: { [Op.substring]: query } },
					attributes: {
						exclude: ['createdAt', 'updatedAt', 'deletedAt', 'categoryId'],
					},
					include: [
						{
							model: categories,
							as: 'category',
							required: true,
							where: { name: { [Op.substring]: category } },
							attributes: ['id', 'name'],
						},
						{
							model: productImage,
							required: true,
							attributes: ['id', 'image']
						}
					]
				},
				{
					model: store,
					required: true,
					where: { UUID: { [Op.substring]: storeUUID } },
					attributes: ['id', 'name'],
					include: [
						{
							model: users,
							as: 'user',
							required: true,
							where: { email: { [Op.substring]: email } },
							attributes: ['name'],
						}
					]
				},
				{
					model: discount,
					required: false,
					attributes: {
						exclude: ['createdAt', 'updatedAt', 'deletedAt'],
					}
				}
			],
			attributes: [[literal('product.name'), 'productName'], [literal('product.price'), 'productPrice'], 'stock', 'id'],
			limit: parseInt(limit),
			offset: page * parseInt(limit) - parseInt(limit),
			order: [order],
			distinct: true,
		}

		if (limit === 'none') {
			delete params.limit;
			delete params.offset;
		}

		const result = await findAndCountAllInventory(params);

		res.status(200).json(resTemplate(200, true, 'Get All Inventory Success', result));
	} catch (error) {
		next(error);
	}
};