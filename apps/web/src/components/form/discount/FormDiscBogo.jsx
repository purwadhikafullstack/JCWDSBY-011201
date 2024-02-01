import { Label, Select, Button, Datepicker, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { onChangeDiscountEndTime, onChangeDiscountName, onChangeDiscountProduct, onChangeDiscountStartTime, onChangeDiscountStore } from "../../../redux/slice/discountSlice";

const FormDiscBogo = ({
    onNext,
    onBack,
    storeData,
    productData,
    // startDateValue,
    errorDate,
    errorName,
    hidden,
}) => {
    const dispatch = useDispatch();
    const discData = useSelector((state) => state.discountReducer);
    const discountTerm = useSelector((state) => state.discountReducer.term);
// console.log('FormDiscBogo.jsx >>> ', discData);
    return <div hidden={discountTerm === 'buy 1 get 1' ? hidden : true}>
        <h1 className="text-2xl font-extrabold text-center mb-5">Buy 1 Get 1</h1>
        <form className="grid gap-4">
            <div className="grid gap-2">
            <Label className="font-bold">Name</Label>
            <TextInput 
            placeholder="Please enter event name"
            value={discData.name}
            onChange={(e) => dispatch(onChangeDiscountName(e.target.value))}
            color={errorName && 'failure'}
            />
            <p className="text-sm text-red-600" hidden={!errorName} >Name is required!</p> 
            </div>
            <div className="grid gap-2">
                <Label className="font-bold">Store</Label>
                <Select onChange={(e) => dispatch(onChangeDiscountStore(e.target.value))} value={discData.storeId}>
                    {storeData && storeData.map((val, index) => <option key={index} value={val.UUID}>{val.name}</option>)}
                </Select>
            </div>
            <div className="grid gap-2">
                <Label className="font-bold">Product</Label>
                <Select onChange={(e) => dispatch(onChangeDiscountProduct(e.target.value))} value={discData.inventoryId || ''} disabled={productData && productData.length ? false : true}>
                    {productData && productData.map((val, index) => <option key={index} value={val.id}>{val.product.name}</option>)}
                </Select>
                <p className="text-sm text-red-600" hidden={productData && productData.length ? true : false}>Product data not found, please select another store!</p>
            </div>
            <div className="grid gap-2">
                <Label className="font-bold">Start Time</Label>
                <Datepicker
                    name="start"
                    minDate={new Date()}
                    value={new Date(discData.startTime).toLocaleDateString('en-EN', {year: 'numeric', month: 'long', day: 'numeric'})}
                    onSelectedDateChanged={(val) => dispatch(onChangeDiscountStartTime(val.toISOString()))}
                />
            </div>
            <div className="grid gap-2">
                <Label className="font-bold">End Time</Label>
                <Datepicker
                    color={errorDate && 'failure'}
                    minDate={new Date(discData.startTime)}
                    value={new Date(discData.endTime).toLocaleDateString('en-EN', {year: 'numeric', month: 'long', day: 'numeric'})}
                    onSelectedDateChanged={(val) => dispatch(onChangeDiscountEndTime(val.toISOString()))}
                />
                <p className="text-sm text-red-600" hidden={!errorDate}>End time should be greater than start time!</p>
            </div>
        </form>
        <div className="flex justify-between mt-6 mb-4">
            <Button color="blue" onClick={onBack}>Back</Button>
            <Button color="blue" onClick={onNext}>Next</Button>
        </div>
    </div>
};

export default FormDiscBogo;