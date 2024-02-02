import React from 'react';
import gopay from '../assets/logoEcom/gopay.png';
import shopeepay from '../assets/logoEcom/shopee.png';
import manualTransfer from '../assets/logoEcom/money.jpg'
import { HiCheck, HiChevronDown } from 'react-icons/hi2';
const SelectPayment = ({
  selectedPayment,
  showPayment,
  onShowPayment,
  onSelectPayment,
}) => {
  const paymentList = [
    { id: 1, name: 'gopay', image: gopay },
    { id: 2, name: 'shopeepay', image: shopeepay },
    { id: 3, name: 'transfer', image: manualTransfer },
  ];

  return (
    <div className="flex flex-col w-full gap-1 bg-white">
      <div
        className="flex w-full rounded-lg justify-between border-2 p-3 gap-3 items-center cursor-pointer"
        onClick={onShowPayment}
      >
        {selectedPayment ? (
          <div className="flex gap-3 md:gap-4 items-center">
            <img
              className="h-6 w-16 object-cover "
              alt={selectedPayment.name}
              src={selectedPayment.image}
            />
            <div className="flex flex-col">
              <span className=" text-sm font-bold text-blue-700">
                {selectedPayment.name == 'transfer'
                  ? 'manual transfer'
                  : selectedPayment.name}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 md:gap-4 items-center">
            <div className="flex flex-col">
              <span className=" text-sm font-bold text-blue-700">
                Pilih metode pembayaran
              </span>
            </div>
          </div>
        )}
        <HiChevronDown
          className={`w-8 h-8 transition-all duration-300 cursor-pointer ${
            showPayment ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </div>
      {showPayment && (
        <div className="flex flex-col gap-1 rounded-lg bg-white transition-all duration-300">
          {paymentList.map((value, idx) => (
            <div
              key={idx}
              className={`flex w-full rounded-lg border-2 p-3 gap-3 items-center justify-between cursor-pointer ${
                value.id === selectedPayment.id ? 'bg-blue-200' : 'bg-white'
              }`}
              onClick={() => {
                onSelectPayment(value);
              }}
            >
              <div className="flex gap-3 md:gap-4 items-center">
                <img
                  className="h-6 w-full object-cover "
                  alt={value.name}
                  src={value.image}
                />
                <div className="flex flex-col">
                  <span className=" text-sm font-bold text-blue-700">
                    {value.name == 'transfer' ? 'manual transfer' : value.name}
                  </span>
                </div>
              </div>
              <HiCheck
                className={`w-8 h-8 text-blue-800 ${
                  value.id !== selectedPayment.id && 'hidden'
                }`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectPayment;
