import { Label, Select, Button, Datepicker, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import { customButton } from "../../../helpers/flowbiteCustomTheme";

const FormBOGO = ({
    onNext,
    onBack,
    onChangeName,
    onChangeStore,
    onChangeProduct,
    onChangeStartTime,
    onChangeEndTime,
    storeData,
    productData,
    startDateValue,
    errorDate,
    errorName,
    hidden,
}) => {
    const currentUserRole = useSelector((reducer) => reducer.userReducer.role);

    return <div hidden={hidden}>
        <h1 className="text-2xl font-extrabold text-center mb-5">Buy 1 Get 1</h1>
        <form className="grid gap-4">
            <div className="grid gap-2">
            <Label className="font-bold">Name</Label>
            <TextInput 
            placeholder="Please enter event name"
            onChange={(e) => onChangeName(e)}
            color={errorName && 'failure'}
            />
            <p className="text-sm text-red-600" hidden={!errorName}>Name is required!</p>
            </div>
            <div className={`grid gap-2 ${currentUserRole !== 'super' && 'hidden'}`}>
                <Label className="font-bold">Store</Label>
                <Select onChange={(e) => onChangeStore(e)}>
                    {storeData && storeData.map((val, index) => <option key={index} value={val.UUID}>{val.name}</option>)}
                </Select>
            </div>
            <div className="grid gap-2">
                <Label className="font-bold">Product</Label>
                <Select onChange={(e) => onChangeProduct(e)} disabled={productData && productData.length ? false : true}>
                    {productData && productData.map((val, index) => <option key={index} value={val.id}>{val.product.name}</option>)}
                </Select>
                <p className="text-sm text-red-600" hidden={productData && productData.length ? true : false}>Product data not found, please select another store!</p>
            </div>
            <div className="grid gap-2">
                <Label className="font-bold">Start Time</Label>
                <Datepicker
                    name="start"
                    minDate={new Date()}
                    onSelectedDateChanged={(e) => onChangeStartTime(e)}
                />
            </div>
            <div className="grid gap-2">
                <Label className="font-bold">End Time</Label>
                <Datepicker
                    color={errorDate && 'failure'}
                    minDate={startDateValue}
                    onSelectedDateChanged={(e) => onChangeEndTime(e)}
                />
                <p className="text-sm text-red-600" hidden={!errorDate}>End time should be greater than start time!</p>
            </div>
        </form>
        <div className="flex justify-between mt-6 mb-4">
            <Button theme={customButton} color="secondary" onClick={onBack}>Back</Button>
            <Button theme={customButton} color="primary" onClick={onNext}>Next</Button>
        </div>
    </div>
};

export default FormBOGO;