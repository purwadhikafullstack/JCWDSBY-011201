import { HiCheck, HiChevronDown, HiMapPin } from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';

const SelectAddressCheckout = ({
  selectedAddress,
  addressData,
  showAddresses,
  onShowAddresses,
  onSelectAddress,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  if (addressData) {
    if (addressData.length > 0) {
      return (
        <div className="flex flex-col w-full p-2 gap-1 bg-white">
          <div
            className="flex w-full rounded-lg justify-between border-2 p-3 gap-3 items-center cursor-pointer"
            onClick={onShowAddresses}
          >
            <div className="flex gap-3 md:gap-4 items-center">
              <HiMapPin className="w-8 h-8 text-blue-800" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-blue-800">
                  Selected Address
                </span>
                <span className="text-xs font-medium text-gray-800">
                  {selectedAddress.address}
                </span>
                <span className="text-xs font-medium text-gray-800">
                  {selectedAddress.district.districtName},
                  {selectedAddress.city.cityName}
                </span>
                <span className="text-xs font-medium text-gray-800">
                  {selectedAddress.province.provinceName},
                  {' ' + selectedAddress.postalCode}
                </span>
              </div>
            </div>
            <HiChevronDown
              className={`w-8 h-8 transition-all duration-300 cursor-pointer ${
                showAddresses ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
          {showAddresses && (
            <div className="flex flex-col gap-1 p-2 md:p-4 rounded-lg bg-blue-50 transition-all duration-300">
              {addressData.map((value, idx) => (
                <div
                  key={value.UUID}
                  className={`flex w-full rounded-lg border-2 p-3 gap-3 items-center justify-between cursor-pointer ${
                    value.UUID === selectedAddress.UUID
                      ? 'bg-blue-200'
                      : 'bg-white'
                  }`}
                  onClick={() => {
                    onSelectAddress(value);
                  }}
                >
                  <div className="flex gap-3 md:gap-4 items-center">
                    <HiMapPin className="w-8 h-8 text-blue-800" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-600">
                        {value.address}
                      </span>
                      <span className="text-xs font-medium line-clamp-1 text-gray-600">
                        {value.district.districtName},{value.city.cityName},
                      </span>
                      <span className="text-xs font-medium text-gray-600">
                        {value.province.provinceName},{' ' + value.postalCode}
                      </span>
                    </div>
                  </div>
                  <HiCheck
                    className={`w-8 h-8 text-blue-800 ${
                      value.UUID !== selectedAddress.UUID && 'hidden'
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col w-full p-2 gap-1 bg-white">
          <div className="flex w-full rounded-lg justify-between border-2 p-3 gap-3 items-center">
            <div className="flex gap-3 md:gap-4 items-center">
              <HiMapPin className="w-8 h-8 text-blue-800" />
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold">
                  No address in range found, Please add another address to your
                  account
                </span>
              </div>
              <span
                className="text-xs font-bold text-blue-800 cursor-pointer"
                onClick={() =>
                  navigate('/profile/address', {
                    state: { previousPath: location.pathname },
                  })
                }
              >
                Manage Address
              </span>
            </div>
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className="flex flex-col w-full p-2 gap-1">
        <div className="flex w-full rounded-lg justify-between border-2 p-3 gap-3 items-center">
          <div className="flex gap-3 md:gap-4 items-center">
            <HiMapPin className="w-8 h-8 text-blue-800" />
            <div className="flex flex-col gap-2 animate-pulse">
              <div className="h-2 md:h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-40"></div>
              <div className="h-2 md:h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-48"></div>
              <div className="h-2 md:h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-36"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SelectAddressCheckout;
