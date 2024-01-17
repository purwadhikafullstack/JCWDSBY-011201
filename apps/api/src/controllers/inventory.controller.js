import inventory from "../models/inventory.model";

export const findAllInventory = async (pointer) => {
    return await inventory.findAll(pointer);
};

export const findOneInventory = async (pointer) => {
    return await inventory.findOne(pointer);
};

export const createInventory = async (data) => {
    return await inventory.create(data);
};

export const updateInventory = async (data, pointer) => {
    return await inventory.update(data, pointer);
};