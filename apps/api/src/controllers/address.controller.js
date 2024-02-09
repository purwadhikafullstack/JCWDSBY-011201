import createAddress from './address/createAddress';
import deleteAddress from './address/deleteAddress';
import getAddressDetail from './address/getAddressDetail';
import getAddresses from './address/getAddresses';
import updateAddress from './address/updateAddress';
import updateDefaultAddress from './address/updateDefaultAddress';

export const getAddressesController = getAddresses;
export const getAddressDetailController = getAddressDetail;
export const createAddressController = createAddress;
export const updateAddressController = updateAddress;
export const updateDefaultAddressController = updateDefaultAddress;
export const deleteAddressController = deleteAddress;
