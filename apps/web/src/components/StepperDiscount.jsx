import { useState, useEffect } from "react";
import StepBar from "./StepBar";
import FormDiscTerm from "./form/discount/FormDiscTerm";
import FormDiscBogo from "./form/discount/FormDiscBogo";
import { getInventory, getStore } from "../helpers/queryData";
import { useSelector } from "react-redux";
import FormDiscProduct from "./form/discount/FormDiscProduct";
import FormDiscMinTransaction from "./form/discount/FormDiscMinTransaction";
import FormDiscSummary from "./form/discount/FormDiscSummary";

const StepperDiscount = ({ onLoading, onSave }) => {
    const storeId = useSelector((state) => state.discountReducer.storeId);
    const [step, setStep] = useState(1);
    const [storeData, setStoreData] = useState(null);
    const [inventoryData, setInventoryData] = useState(null);

    useEffect(() => {
        getStore(setStoreData, onLoading);
    }, [])
    
    useEffect(() => {
        storeId && getInventory(setInventoryData, null, { store: storeId, limit: 'none' });
    }, [storeId])

    return <div className="grid gap-4 lg:w-2/5 m-auto">
        <StepBar
            stepTitle={['Discount Term', 'Update Discount', 'Confirm']}
            mobileTitle={['Term', 'Update', 'Confirm']}
            stepColor={'text-blue-600'}
            onStep={step}
            onClickStep={(val) => setStep(val)}
        />
        <div className="border bg-white p-4 rounded-lg shadow-md">
            <FormDiscTerm
                onNext={() => setStep(2)}
                hidden={step !== 1}
            />
            <FormDiscBogo
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
                hidden={step !== 2}
                storeData={storeData}
                productData={inventoryData}
            />
            <FormDiscProduct
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
                hidden={step !== 2}
                storeData={storeData}
                productData={inventoryData}
            />
            <FormDiscMinTransaction
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
                storeData={storeData}
                hidden={step !== 2}
            />
            <FormDiscSummary
                onBack={() => setStep(2)}
                onCreate={onSave}
                hidden={step !== 3}
                storeData={storeData}
                productData={inventoryData}
            />
        </div>
    </div>
};

export default StepperDiscount;