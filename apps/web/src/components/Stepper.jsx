import { useState, useEffect } from "react";
import FormDiscountTerm from "./form/discount/FormDiscountTerm";
import FormBOGO from "./form/discount/FormBOGO";
import { getInventory, getStore } from "../helpers/queryData";
import FormSummary from "./form/discount/FormSummary";
import FormDiscountProduct from "./form/discount/FormDiscountProduct";
import FormDiscountMinTransaction from "./form/discount/FormDiscountMinTransaction";
import StepBar from "./StepBar";
import { useSelector } from "react-redux";

const Stepper = ({ onLoading, onCreate, errorDuplicateVoucher }) => {
    const [formValue, setFormValue] = useState({ name: null, limit: null, term: 'buy 1 get 1', storeId: null, inventoryId: null, minTransaction: null, type: 'percentage', nominal: null, percentage: null, voucherCode: null, startTime: new Date(new Date().toDateString()), endTime: new Date(new Date().toDateString()) });
    const [storeData, setStoreData] = useState(null);
    const [inventoryData, setInventoryData] = useState(null);
    const [discAmount, setDiscAmount] = useState({ nominal: null, percentage: null, });
    const [minTransactionAmount, setMinTransactionAmount] = useState(null)
    const [isError, setIsError] = useState({ name: false, amount: false, minTransaction: false, date: false, voucher: false, limit: false });
    const [step, setStep] = useState(1);
    const currentUser = useSelector(state => state.userReducer)

    useEffect(() => {
        getStore(setStoreData, onLoading, (e) => setFormValue({ ...formValue, storeId: e }));
    }, [])

    useEffect(() => {
        formValue.storeId && getInventory(setInventoryData, null, currentUser.role === 'admin' ? {limit: 'none', admin: currentUser.email} : { store: formValue.storeId, limit: 'none' }, (e) => setFormValue({ ...formValue, inventoryId: e }));
    }, [formValue.storeId])

    useEffect(() => {
        errorDuplicateVoucher && setStep(2);
    }, [errorDuplicateVoucher])

    const handleCreateButton = () => {
        if (!formValue.name) {
            setIsError({ ...isError, name: true });
            return setStep(2);
        }
        if (formValue.term === 'min transaction') {
            if(!formValue.minTransaction) setIsError({ ...isError, minTransaction: true });
            if(!formValue.limit) setIsError({ ...isError, limit: true });
            if(!formValue.voucherCode) setIsError({ ...isError, voucher: true });
            if(!formValue.minTransaction || !formValue.voucherCode || !formValue.limit)return setStep(2);
        }
        if (formValue.term === 'product' || formValue.term === 'min transaction') {
            if (formValue.type === 'percentage' && !formValue.percentage) {
                setIsError({ ...isError, amount: true });
                return setStep(2);
            }
            if (formValue.type === 'nominal' && !formValue.nominal) {
                setIsError({ ...isError, amount: true });
                return setStep(2);
            }
        }
        if (formValue.endTime < formValue.startTime) {
            setIsError({ ...isError, date: true });
            return setStep(2);
        }
        let payload = {name: formValue.name ,term: formValue.term, storeId: storeData.find((val) => val.UUID === formValue.storeId).id, inventoryId: formValue.inventoryId, type: formValue.type, startTime: formValue.startTime, endTime: formValue.endTime };
        if (payload.type === 'percentage') {
            payload.percentage = formValue.percentage;
        } else payload.nominal = formValue.nominal;
        if (payload.term === 'min transaction') {
            delete payload.inventoryId;
            payload.minTransaction = formValue.minTransaction;
            payload.voucherCode = formValue.voucherCode.toUpperCase();
            payload.limit = formValue.limit;
        }
        if (formValue.term === 'buy 1 get 1') {
            delete payload.type;
            delete payload.percentage;
        }

        onCreate(payload)
    };

    const handleChangeDiscountAmount = (val) => {
        if (formValue.type === 'percentage') {
            setFormValue({ ...formValue, percentage: val.value / 100 });
            setDiscAmount({ ...discAmount, percentage: val.formatted });
            return setIsError({ ...isError, amount: false });
        }
        setFormValue({ ...formValue, nominal: val.value });
        setDiscAmount({ ...discAmount, nominal: val.formatted });
        return setIsError({ ...isError, amount: false });
    };

    return <>
        <div className="grid gap-4 lg:w-2/5 m-auto">
            <StepBar
            stepTitle={['Discount Terms' ,'Create Discount', 'Confirm']}
            mobileTitle={['Terms' ,'Create', 'Confirm']}
            stepColor={'text-indigo-700'}
            onStep={step}
            onClickStep={(val) => setStep(val)}
            />
            <div className="border bg-white p-4 rounded-lg shadow-md">
                <FormDiscountTerm
                    onNext={() => setStep(2)}
                    onChange={(e) => { setFormValue({ ...formValue, term: e.target.value, minTransaction: null, percentage: null, nominal: null, startTime: new Date(new Date().toDateString()), endTime: new Date(new Date().toDateString()) }); setDiscAmount({ nominal: null, percentage: null }) }}
                    hidden={step !== 1}
                />
                <FormBOGO
                    hidden={formValue.term === 'buy 1 get 1' ? step !== 2 : true}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                    storeData={storeData}
                    onChangeName={(e) => { setFormValue({ ...formValue, name: e.target.value }); setIsError({ ...isError, name: false }); }}
                    onChangeStore={(e) => setFormValue({ ...formValue, storeId: e.target.value })}
                    productData={inventoryData}
                    onChangeProduct={(e) => setFormValue({ ...formValue, inventoryId: e.target.value })}
                    onChangeStartTime={(e) => setFormValue({ ...formValue, startTime: e })}
                    onChangeEndTime={(e) => { setFormValue({ ...formValue, endTime: e }); setIsError({ ...isError, date: false }) }}
                    startDateValue={formValue.startTime}
                    errorDate={isError.date}
                    errorName={isError.name}
                />
                <FormDiscountProduct
                    hidden={formValue.term === 'product' ? step !== 2 : true}
                    isError={isError.amount}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                    storeData={storeData}
                    onChangeName={(e) => { setFormValue({ ...formValue, name: e.target.value }); setIsError({ ...isError, name: false }); }}
                    onChangeStore={(e) => setFormValue({ ...formValue, storeId: e.target.value })}
                    productData={inventoryData}
                    onChangeProduct={(e) => setFormValue({ ...formValue, inventoryId: e.target.value })}
                    defaultDiscountType={formValue.type}
                    onChangeDiscountType={(e) => { setFormValue({ ...formValue, type: e.target.value }); setIsError({ ...isError, amount: false }) }}
                    onChangeDiscountAmount={(value, name, values) => handleChangeDiscountAmount(values)}
                    percentageValue={formValue.percentage}
                    nominalValue={formValue.nominal}
                    onChangeStartTime={(e) => setFormValue({ ...formValue, startTime: e })}
                    onChangeEndTime={(e) => { setFormValue({ ...formValue, endTime: e }); setIsError({ ...isError, date: false }) }}
                    startDateValue={formValue.startTime}
                    errorDate={isError.date}
                    errorName={isError.name}
                />
                <FormDiscountMinTransaction
                    hidden={formValue.term === 'min transaction' ? step !== 2 : true}
                    errorAmount={isError.amount}
                    errorMinTransaction={isError.minTransaction}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                    storeData={storeData}
                    onChangeStore={(e) => setFormValue({ ...formValue, storeId: e.target.value })}
                    defaultDiscountType={formValue.type}
                    onChangeDiscountType={(e) => { setFormValue({ ...formValue, type: e.target.value }); setIsError({ ...isError, amount: false }) }}
                    onChangeDiscountAmount={(value, name, values) => handleChangeDiscountAmount(values)}
                    onChangeMinTransaction={(e) => { setFormValue({ ...formValue, minTransaction: e.value }); setMinTransactionAmount(e.formatted); setIsError({ ...isError, minTransaction: false }) }}
                    onChangeVoucherCode={(e) => { setFormValue({ ...formValue, voucherCode: e.target.value }); setIsError({ ...isError, voucher: false }) }}
                    onChangeName={(e) => { setFormValue({ ...formValue, name: e.target.value }); setIsError({ ...isError, name: false }); }}
                    onChangeLimit={(e) => { setFormValue({ ...formValue, limit: e.target.value }); setIsError({ ...isError, limit: false }); }}
                    minTransactionValue={formValue.minTransaction}
                    nominalValue={formValue.nominal}
                    percentageValue={formValue.percentage}
                    onChangeStartTime={(e) => setFormValue({ ...formValue, startTime: e })}
                    onChangeEndTime={(e) => { setFormValue({ ...formValue, endTime: e }); setIsError({ ...isError, date: false }) }}
                    startDateValue={formValue.startTime}
                    errorDate={isError.date}
                    errorVoucherCode={isError.voucher}
                    errorDuplicateVoucherCode={errorDuplicateVoucher}
                    errorName={isError.name}
                    errorLimit={isError.limit}
                />
                <FormSummary
                    hidden={step !== 3}
                    summaryData={formValue}
                    storeData={storeData}
                    productData={inventoryData}
                    discAmount={formValue.type === 'percentage' ? discAmount.percentage : discAmount.nominal}
                    minTransactionAmount={minTransactionAmount}
                    onCreate={handleCreateButton}
                    onBack={() => setStep(2)}
                />
            </div>
        </div>
    </>
};

export default Stepper;