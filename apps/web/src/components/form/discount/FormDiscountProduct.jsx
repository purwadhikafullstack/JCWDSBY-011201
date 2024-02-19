import { Label, Select, Radio, Button, Datepicker, TextInput } from "flowbite-react";
import CurrencyInput from "react-currency-input-field";
import { customButton } from "../../../helpers/flowbiteCustomTheme";
import { useSelector } from "react-redux";

const FormDiscountProduct = ({
    onNext,
    onBack,
    onChangeName,
    onChangeStore,
    onChangeProduct,
    onChangeDiscountType,
    onChangeDiscountAmount,
    onChangeStartTime,
    onChangeEndTime,
    defaultDiscountType,
    percentageValue,
    nominalValue,
    storeData,
    productData,
    startDateValue,
    errorDate,
    isError,
    errorName,
    hidden,
}) => {
    const currentUserRole = useSelector((reducer) => reducer.userReducer.role);
    
    const handleRequiredField = () => {
        if (isError) return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500"
        return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
    };

    return <div hidden={hidden}>
        <h1 className="text-2xl font-extrabold text-center mb-5">Discount Product</h1>
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
            </div>
            <div className="grid gap-2">
                <Label className="font-bold">Discount Type</Label>
                <fieldset className="flex gap-7">
                    <div className="flex items-center gap-2">
                        <Radio name="type" value={'percentage'} onChange={(e) => onChangeDiscountType(e)} checked={defaultDiscountType === 'percentage'} />
                        <Label>Percentage</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Radio name="type" value={'nominal'} onChange={(e) => onChangeDiscountType(e)} checked={defaultDiscountType === 'nominal'} />
                        <Label>Nominal</Label>
                    </div>
                </fieldset>
            </div>
            <div className="grid gap-2">
                <Label className="font-bold">Discount Amount</Label>
                <CurrencyInput
                    className={handleRequiredField()}
                    id="input-nominal"
                    name="input-nominal"
                    placeholder="Please enter discount nominal"
                    allowDecimals={false}
                    allowNegativeValue={false}
                    intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                    value={nominalValue}
                    onValueChange={(value, name, values) => onChangeDiscountAmount(value, name, values)}
                    hidden={defaultDiscountType !== 'nominal'}
                />
                <CurrencyInput
                    className={handleRequiredField()}
                    id="input-percentage"
                    name="input-percentage"
                    placeholder="Please enter discount percentage"
                    allowDecimals={false}
                    allowNegativeValue={false}
                    suffix="%"
                    value={percentageValue && percentageValue * 100}
                    onValueChange={(value, name, values) => onChangeDiscountAmount(value, name, values)}
                    hidden={defaultDiscountType !== 'percentage'}
                    min={0}
                    max={100}
                />
                <p className="text-sm text-red-600" hidden={!isError}>Discount Amount is required!</p>
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

export default FormDiscountProduct;