import { Button, Card, Label, TextInput } from 'flowbite-react';
import React from 'react';
import SelectAddressCheckout from './SelectAddressCheckout';
import SelectCourierCheckout from './SelectCourierCheckout';
import SelectPayment from './SelectPayment';
import { handleVoucher } from '../helpers/checkout/handlePay';
export function CheckoutLeftSide({
  showSnap,
  selectedAddress,
  address,
  showAddresses,
  setShowAddresses,
  setShowCourier,
  setCourier,
  setSelectedAddress,
  selectedCourier,
  courier,
  showCourier,
  setSelectedCourier,
  selectedPayment,
  showPayment,
  setShowPayment,
  setSelectedPayment,
  setVoucher,
  voucher,
  itemTotal,
  setVoucherData,
  cartItems,
}) {
  console.log('🚀 ~ cartItems:', cartItems);
  return (
    <div className="w-full lg:w-8/12 h-[100vh] overflow-y-auto lg:h-full font-roboto flex flex-col bg-gray-100 ">
      {!showSnap && (
        <div className="flex flex-col">
          <Card className="flex flex-col rounded-none capitalize text-xs sm:text-sm mb-3">
            <SelectAddressCheckout
              selectedAddress={selectedAddress}
              addressData={address}
              showAddresses={showAddresses}
              onShowAddresses={() => setShowAddresses((prev) => !prev)}
              onSelectAddress={(value) => {
                setShowCourier(false);
                setShowAddresses(false);

                if (selectedAddress.UUID !== value.UUID) {
                  setCourier(null);
                }

                setSelectedAddress(value);
              }}
            />
          </Card>
          <Card className="flex flex-col rounded-none capitalize text-xs sm:text-sm mb-3">
            <SelectCourierCheckout
              selectedCourier={selectedCourier}
              courierData={courier}
              showCouriers={showCourier}
              onShowCouriers={() => setShowCourier((prev) => !prev)}
              onSelectCourier={(value) => {
                setShowCourier(false);
                setSelectedCourier(value);
              }}
            />
          </Card>
          <Card className="flex flex-col rounded-none capitalize text-xs md:text-base mb-3 w-full ">
            <p className="font-semibold">rincian pesanan</p>
            <div className="flex flex-col md:gap-3 overflow-auto ">
              {cartItems.map((val, idx) => {
                return (
                  <div className="justify-between flex w-full" key={idx}>
                    <div className="flex justify-start gap-x-2 ">
                      <div className=" rounded justify-center items-center flex">
                        <img
                          className="w-12 lg:w-16 h-12 lg:h-16 object-contain"
                          src={val.imageLink}
                        />
                      </div>
                      <div className="flex-col  items-start text-start gap-y-2 flex w-full">
                        <div className="flex-col flex">
                          <div className="text-black text-xs md:text-sm capitalize truncate  ">
                            {val.productName}
                          </div>
                        </div>
                        <div className="flex flex-row justify-start items-start gap-1 w-full ">
                          <div className="flex w-full">
                            <div className="text-black text-xs font-bold">
                              Rp{' '}
                              {(val.discountedPrice
                                ? val.discountedPrice * val.amount
                                : val.productPrice * val.amount
                              ).toLocaleString('id-ID')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card className="flex flex-col rounded-none capitalize text-xs sm:text-sm mb-3">
            <p className="font-semibold">metode pembayaran</p>
            <SelectPayment
              selectedPayment={selectedPayment}
              showPayment={showPayment}
              onShowPayment={() => setShowPayment((prev) => !prev)}
              onSelectPayment={(value) => {
                setShowPayment(false);
                setSelectedPayment(value);
              }}
            />
          </Card>
          <Card className="flex flex-col rounded-none capitalize text-xs sm:text-sm mb-3">
            <div className="mb-2 block">
              <Label
                htmlFor="voucher"
                className="font-semibold"
                value="Kode Voucher"
              />
            </div>
            <TextInput
              id="voucher"
              type="text"
              placeholder="XXXXXX......"
              required
              onChange={(e) => setVoucher(e.target.value)}
            />
            <Button
              color="blue"
              className="mt-3"
              onClick={() => handleVoucher(voucher, itemTotal, setVoucherData)}
            >
              Apply
            </Button>
          </Card>
          <Card className="flex lg:hidden flex-col rounded-none capitalize mb-3">
            <p className="font-bold text-base mb-2">ringkasan belanja</p>
            <div className="flex justify-between">
              <p className=" text-sm">
                Total Harga ({cartItems?.length} barang)
              </p>
              <p className=" text-sm">
                Rp {(itemTotal || 0).toLocaleString('id-ID')}
              </p>
            </div>
            {selectedCourier && (
              <div className="flex justify-between">
                <p className=" text-sm">Total Ongkos Kirim</p>
                <p className=" text-sm">
                  Rp {(selectedCourier?.price || 0).toLocaleString('id-ID')}
                </p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
