import { useState, useEffect } from "react";
import FormDiscountTerm from "./form/discount/FormDiscountTerm";
import FormBOGO from "./form/discount/FormBOGO";
import { getInventory, getStore } from "../helpers/queryData";
import FormSummary from "./form/discount/FormSummary";
import FormDiscountProduct from "./form/discount/FormDiscountProduct";
import FormDiscountMinTransaction from "./form/discount/FormDiscountMinTransaction";

const Stepper = ({ onLoading, onCreate, errorDuplicateVoucher }) => {
    const [stepColor, setStepColor] = useState({ a: 'text-blue-600', b: '', c: '' });
    const [formValue, setFormValue] = useState({ name: null, limit: null, term: 'buy 1 get 1', storeId: null, inventoryId: null, minTransaction: null, type: 'percentage', nominal: null, percentage: null, voucherCode: null, startTime: new Date(new Date().toDateString()), endTime: new Date(new Date().toDateString()) });
    const [formStep, setFormStep] = useState({ form1: true, form2: false, form3: false });
    const [storeData, setStoreData] = useState(null);
    const [inventoryData, setInventoryData] = useState(null);
    const [discAmount, setDiscAmount] = useState({ nominal: null, percentage: null, });
    const [minTransactionAmount, setMinTransactionAmount] = useState(null)
    const [isError, setIsError] = useState({ name: false, amount: false, minTransaction: false, date: false, voucher: false, limit: false });

    useEffect(() => {
        getStore(setStoreData, onLoading, (e) => setFormValue({ ...formValue, storeId: e }));
    }, [])

    useEffect(() => {
        formValue.storeId && getInventory(setInventoryData, null, { store: formValue.storeId, limit: 'none' }, (e) => setFormValue({ ...formValue, inventoryId: e }));
    }, [formValue.storeId])

    useEffect(() => {
        errorDuplicateVoucher && handleClickStep(2);
    }, [errorDuplicateVoucher])

    const handleClickStep = (step) => {
        if (step === 1) {
            setStepColor({ a: 'text-blue-600', b: '', c: '' });
            setFormStep({ form1: true, form2: false, form3: false });
        }
        if (step === 2) {
            setStepColor({ a: 'text-blue-600', b: 'text-blue-600', c: '' });
            setFormStep({ form1: false, form2: true, form3: false });
        }
        if (step === 3) {
            setStepColor({ a: 'text-blue-600', b: 'text-blue-600', c: 'text-blue-600' })
            setFormStep({ form1: false, form2: false, form3: true });
        }
    };

    const handleCreateButton = () => {
        if (!formValue.name) {
            setIsError({ ...isError, name: true });
            return handleClickStep(2);
        }
        if (formValue.term === 'min transaction') {
            if(!formValue.minTransaction) setIsError({ ...isError, minTransaction: true });
            if(!formValue.limit) setIsError({ ...isError, limit: true });
            if(!formValue.voucherCode) setIsError({ ...isError, voucher: true });
            if(!formValue.minTransaction || !formValue.voucherCode || !formValue.limit)return handleClickStep(2);
        }
        if (formValue.term === 'product' || formValue.term === 'min transaction') {
            if (formValue.type === 'percentage' && !formValue.percentage) {
                setIsError({ ...isError, amount: true });
                return handleClickStep(2);
            }
            if (formValue.type === 'nominal' && !formValue.nominal) {
                setIsError({ ...isError, amount: true });
                return handleClickStep(2);
            }
        }
        if (formValue.endTime < formValue.startTime) {
            setIsError({ ...isError, date: true });
            return handleClickStep(2);
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
            <div>
                <ol className="flex items-center justify-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm sm:text-base sm:p-4 sm:space-x-4">
                    <li className={`flex items-center cursor-pointer ${stepColor.a}`} onClick={() => handleClickStep(1)}>
                        <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                            1
                        </span>
                        <span className="hidden sm:inline-flex">Discount</span> <span className="inline-flex sm:ms-2">Term</span>
                        <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4" />
                        </svg>
                    </li>
                    <li className={`flex items-center cursor-pointer ${stepColor.b}`} onClick={() => handleClickStep(2)}>
                        <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                            2
                        </span>
                        Create <span className="hidden sm:inline-flex sm:ms-2">Discount</span>
                        <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4" />
                        </svg>
                    </li>
                    <li className={`flex items-center cursor-pointer ${stepColor.c}`} onClick={() => handleClickStep(3)}>
                        <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                            3
                        </span>
                        Confirm
                    </li>
                </ol>
            </div>
            <div className="border bg-white p-4 rounded-lg shadow-md">
                <FormDiscountTerm
                    onNext={() => handleClickStep(2)}
                    onChange={(e) => { setFormValue({ ...formValue, term: e.target.value, minTransaction: null, percentage: null, nominal: null, startTime: new Date(new Date().toDateString()), endTime: new Date(new Date().toDateString()) }); setDiscAmount({ nominal: null, percentage: null }) }}
                    hidden={!formStep.form1}
                />
                {/* FORM Buy 1 Get 1 */}
                <FormBOGO
                    hidden={formValue.term === 'buy 1 get 1' && formStep.form2 ? false : true}
                    onNext={() => handleClickStep(3)}
                    onBack={() => handleClickStep(1)}
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
                {/* FORM Discount Product */}
                <FormDiscountProduct
                    hidden={formValue.term === 'product' && formStep.form2 ? false : true}
                    isError={isError.amount}
                    onNext={() => handleClickStep(3)}
                    onBack={() => handleClickStep(1)}
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
                {/* FORM Discount with Minimum Transaction */}
                <FormDiscountMinTransaction
                    hidden={formValue.term === 'min transaction' && formStep.form2 ? false : true}
                    errorAmount={isError.amount}
                    errorMinTransaction={isError.minTransaction}
                    onNext={() => handleClickStep(3)}
                    onBack={() => handleClickStep(1)}
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
                {/* Summary */}
                <FormSummary
                    hidden={!formStep.form3}
                    summaryData={formValue}
                    storeData={storeData}
                    productData={inventoryData}
                    discAmount={formValue.type === 'percentage' ? discAmount.percentage : discAmount.nominal}
                    minTransactionAmount={minTransactionAmount}
                    onCreate={handleCreateButton}
                    onBack={() => handleClickStep(2)}
                />
            </div>
        </div>
    </>
};

export default Stepper;