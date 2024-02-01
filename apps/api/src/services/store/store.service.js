import stores from "../../models/stores.model";

export const getStoreByUUIDService = async (UUID) => {
    try {
        const result = await stores.findOne({
            where: {UUID},
        });
        return result
    } catch (error) {
        throw error;
    }
};