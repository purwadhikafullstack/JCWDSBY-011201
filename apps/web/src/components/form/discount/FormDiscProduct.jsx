import { Label, Select, Button, Datepicker, TextInput } from "flowbite-react";
import CurrencyInput from "react-currency-input-field";
import { useDispatch, useSelector } from "react-redux";
import { onChangeDiscountEndTime, onChangeDiscountName, onChangeDiscountNominal, onChangeDiscountPercentage, onChangeDiscountProduct, onChangeDiscountStartTime, onChangeDiscountStore, onChangeDiscountType } from "../../../redux/slice/discountSlice";
import { customButton } from "../../../helpers/flowbiteCustomTheme";

const FormDiscProduct = ({
    onNext,
    onBack,
    storeData,
    productData,
    errorDate,
    isError,
    errorName,
    hidden,
    hiddenBackButton,
}) => {
    const dispatch = useDispatch();
    const discData = useSelector((state) => state.discountReducer);
    const discountTerm = useSelector((state) => state.discountReducer.term);
    const currentUser = useSelector((state) => state.userReducer);
    const handleRequiredField = () => {
        if (isError) return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500"
        return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
    };

    return <div hidden={discountTerm === 'product' ? hidden : true}>
        <h1 className="text-2xl font-extrabold text-center mb-5">Discount Product</h1>
        <form className="grid gap-4">
            <div className="grid gap-2">
                <Label className="font-bold">Name</Label>
                <TextInput
                    placeholder="Please enter event name"
                    value={discData.name}
                    onChange={(e) => dispatch(onChangeDiscountName(e.target.value))}
                    color={errorName && 'failure'}
                />
                <p className="text-sm text-red-600" hidden={!errorName}>Name is required!</p>
            </div>
            <div className={`grid gap-2 ${currentUser.role !== 'super' && 'hidden'}`}>
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
            </div>
            <div className="grid gap-2">
                <Label className="font-bold">Discount Type</Label>
                <Select onChange={(e) => dispatch(onChangeDiscountType(e.target.value))} value={discData.type || ''}>
                    <option value={'percentage'}>Percentage</option>
                    <option value={'nominal'}>Nominal</option>
                </Select>
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
                    value={discData.nominal || ''}
                    onValueChange={(value) => dispatch(onChangeDiscountNominal(value))}
                    hidden={discData.type !== 'nominal'}
                />
                <CurrencyInput
                    className={handleRequiredField()}
                    id="input-percentage"
                    name="input-percentage"
                    placeholder="Please enter discount percentage"
                    allowDecimals={false}
                    allowNegativeValue={false}
                    suffix="%"
                    value={isNaN(discData.percentage) ? '' : discData.percentage * 100}
                    onValueChange={(value) => dispatch(onChangeDiscountPercentage(value/100))}
                    hidden={discData.type === 'percentage' ? false : discData.type ?? false}
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
        <div className={`flex mt-6 mb-4 ${hiddenBackButton ? 'justify-end' : 'justify-between'}`}>
            <Button theme={customButton} color="secondary" onClick={onBack} className={`${hiddenBackButton && 'hidden'}`}>Back</Button>
            <Button theme={customButton} color="primary" onClick={onNext}>Next</Button>
        </div>
    </div>
};

export default FormDiscProduct;