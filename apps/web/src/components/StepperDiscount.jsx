import { useState, useEffect } from "react";
import StepBar from "./StepBar";
import FormDiscBogo from "./form/discount/FormDiscBogo";
import { getInventory, getStore } from "../helpers/queryData";
import { useSelector } from "react-redux";
import FormDiscProduct from "./form/discount/FormDiscProduct";
import FormDiscMinTransaction from "./form/discount/FormDiscMinTransaction";
import FormDiscSummary from "./form/discount/FormDiscSummary";

const StepperDiscount = ({ onLoading, onSave, errorDuplicateVoucher }) => {
  const storeId = useSelector((state) => state.discountReducer.storeId);
  const currentUser = useSelector((state) => state.userReducer);
  const discData = useSelector((state) => state.discountReducer);
  const [step, setStep] = useState(1);
  const [storeData, setStoreData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [isError, setIsError] = useState({ name: false, amount: false, minTransaction: false, date: false, voucher: false, limit: false });

  useEffect(() => {
    if (currentUser.role === 'super') getStore(setStoreData, onLoading);
  }, [])

  useEffect(() => {
    storeId && getInventory(setInventoryData, null, { store: storeId, limit: 'none' });
  }, [storeId])

  useEffect(() => {
    errorDuplicateVoucher && setStep(1);
}, [errorDuplicateVoucher])

  const handleCreateButton = () => {
    if (!discData.name) {
      setIsError({ ...isError, name: true });
      return setStep(1);
    }
    if (discData.term === 'product' || discData.term === 'min transaction') {
      if (discData.type === 'percentage' && !discData.percentage) {
        setIsError({ ...isError, amount: true });
        return setStep(1);
      }
      if (discData.type === 'nominal' && !discData.nominal) {
        setIsError({ ...isError, amount: true });
        return setStep(1);
      }
    }
    if (discData.term === 'min transaction') {
      if (!discData.minTransaction) setIsError({ ...isError, minTransaction: true });
      if (!discData.limit) setIsError({ ...isError, limit: true });
      if (!discData.voucherCode) setIsError({ ...isError, voucher: true });
      if (!discData.minTransaction || !discData.voucherCode || !discData.limit) return setStep(1);
    }
    if (discData.endTime < discData.startTime) {
      setIsError({ ...isError, date: true });
      return setStep(1);
    }
    setIsError({ name: false, amount: false, minTransaction: false, date: false, voucher: false, limit: false });
    onSave
  };

  return <div className="grid gap-4 lg:w-2/5 m-auto">
    <StepBar
      stepTitle={['Update Discount', 'Confirm']}
      mobileTitle={['Update', 'Confirm']}
      stepColor={'text-indigo-700'}
      onStep={step}
      onClickStep={(val) => setStep(val)}
    />
    <div className="border bg-white p-4 rounded-lg shadow-md mb-20">
      <FormDiscBogo
        onNext={() => setStep(2)}
        hiddenBackButton={true}
        hidden={step !== 1}
        storeData={storeData}
        productData={inventoryData}
        errorName={isError.name}
        errorDate={isError.date}
      />
      <FormDiscProduct
        onNext={() => setStep(2)}
        hiddenBackButton={true}
        hidden={step !== 1}
        storeData={storeData}
        productData={inventoryData}
        errorDate={isError.date}
        errorName={isError.name}
        isError={isError.amount}
      />
      <FormDiscMinTransaction
        onNext={() => setStep(2)}
        hiddenBackButton={true}
        storeData={storeData}
        hidden={step !== 1}
        errorAmount={isError.amount}
        errorMinTransaction={isError.minTransaction}
        errorDate={isError.date}
        errorVoucherCode={isError.voucher}
        errorDuplicateVoucherCode={errorDuplicateVoucher}
        errorName={isError.name}
        errorLimit={isError.limit}
      />
      <FormDiscSummary
        onBack={() => setStep(1)}
        onCreate={handleCreateButton}
        hidden={step !== 2}
        storeData={storeData}
        productData={inventoryData}
      />
    </div>
  </div>
};

export default StepperDiscount;