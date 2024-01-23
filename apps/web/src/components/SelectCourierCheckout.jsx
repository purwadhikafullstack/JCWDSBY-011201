import { HiCheck, HiChevronDown, HiTruck } from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';

const SelectCourierCheckout = ({
  selectedCourier,
  courierData,
  showCouriers,
  onShowCouriers,
  onSelectCourier,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  if (courierData) {
    if (courierData.length > 0) {
      return (
        <div className="flex flex-col w-full p-2 gap-1">
          <div
            className="flex w-full rounded-lg justify-between border-2 p-3 gap-3 items-center cursor-pointer"
            onClick={onShowCouriers}
          >
            <div className="flex gap-3 md:gap-4 items-center">
              <HiTruck className="w-8 h-8 text-blue-800" />
              <div className="flex flex-col">
                <span className=" text-sm font-bold text-blue-700">
                  {selectedCourier.courier_name}
                </span>
                <div className="flex gap-1 items-baseline">
                  <span className="text-xs font-bold text-gray-600">
                    {selectedCourier.courier_service}
                  </span>
                  <span className="text-xs font-semibold text-gray-600">
                    {selectedCourier.duration}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {selectedCourier.price.toLocaleString('id', {
                    style: 'currency',
                    currency: 'idr',
                  })}
                </span>
              </div>
            </div>
            <HiChevronDown
              className={`w-8 h-8 transition-all duration-300 cursor-pointer ${
                showCouriers ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
          {showCouriers && (
            <div className="flex flex-col gap-1 p-2 md:p-4 rounded-lg bg-blue-50 transition-all duration-300">
              {courierData.map((value, idx) => (
                <div
                  key={value.courier_id}
                  className={`flex w-full rounded-lg border-2 p-3 gap-3 items-center justify-between cursor-pointer ${
                    value.courier_id === selectedCourier.courier_id
                      ? 'bg-blue-200'
                      : 'bg-white'
                  }`}
                  onClick={() => {
                    onSelectCourier(value);
                  }}
                >
                  <div className="flex gap-3 md:gap-4 items-center">
                    <HiTruck className="w-8 h-8 text-blue-800" />
                    <div className="flex flex-col">
                      <span className=" text-sm font-bold text-blue-700">
                        {value.courier_name}
                      </span>
                      <div className="flex gap-1 items-baseline">
                        <span className="text-xs font-bold text-gray-600">
                          {value.courier_service}
                        </span>
                        <span className="text-xs font-semibold text-gray-600">
                          {value.duration}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {value.price.toLocaleString('id', {
                          style: 'currency',
                          currency: 'idr',
                        })}
                      </span>
                    </div>
                  </div>
                  <HiCheck
                    className={`w-8 h-8 text-blue-800 ${
                      value.courier_id !== selectedCourier.courier_id &&
                      'hidden'
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
        <div className="flex flex-col w-full p-2 gap-1">
          <div className="flex w-full rounded-lg justify-between border-2 p-3 gap-3 items-center">
            <div className="flex gap-3 md:gap-4 items-center">
              <HiTruck className="w-8 h-8 text-blue-800" />
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold">
                  No courier available for this address
                </span>
              </div>
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
            <HiTruck className="w-8 h-8 text-blue-800" />
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

export default SelectCourierCheckout;
