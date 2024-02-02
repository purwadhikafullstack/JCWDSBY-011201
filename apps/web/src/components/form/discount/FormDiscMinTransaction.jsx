import { Label, Select, Button, Datepicker, TextInput } from "flowbite-react";
import CurrencyInput from "react-currency-input-field";
import { useDispatch, useSelector } from "react-redux";
import { onChangeDiscountType, onChangeDiscountEndTime, onChangeDiscountLimit, onChangeDiscountMinTransaction, onChangeDiscountName, onChangeDiscountNominal, onChangeDiscountPercentage, onChangeDiscountStartTime, onChangeDiscountStore, onChangeVoucherCode } from "../../../redux/slice/discountSlice";

const FormDiscMinTransaction = ({
    hidden,
    errorAmount,
    errorMinTransaction,
    onNext,
    onBack,
    storeData,
    errorDate,
    errorVoucherCode,
    errorDuplicateVoucherCode,
    errorName,
    errorLimit,
}) => {
    const dispatch = useDispatch();
    const discData = useSelector((state) => state.discountReducer);
    const discountTerm = useSelector((state) => state.discountReducer.term);

    const handleErrorAmount = () => {
        if (errorAmount) return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500"
        return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
    };

    const handleErrorMinTransaction = () => {
        if (errorMinTransaction) return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500"
        return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
    };

    return <div hidden={discountTerm === 'min transaction' ? hidden : true}>
        <h1 className="text-2xl font-extrabold text-center mb-5">Discount with Minimum Transaction</h1>
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
            <div className="grid gap-2">
                <Label className="font-bold">Store</Label>
                <Select onChange={(e) => dispatch(onChangeDiscountStore(e.target.value))} value={discData.storeId}>
                    {storeData && storeData.map((val, index) => <option key={index} value={val.UUID}>{val.name}</option>)}
                </Select>
            </div>
            <div className="grid gap-2">
                <Label className="font-bold">Minimum Transaction</Label>
                <CurrencyInput
                    className={handleErrorMinTransaction()}
                    id="input-minTransaction"
                    name="input-minTransaction"
                    placeholder="Please enter minimum transaction"
                    allowDecimals={false}
                    allowNegativeValue={false}
                    intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                    onValueChange={(value) => dispatch(onChangeDiscountMinTransaction(value))}
                    value={discData.minTransaction}
                />
                <p className="text-sm text-red-600" hidden={!errorMinTransaction}>Minimum Transaction Amount is required!</p>
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
                    className={handleErrorAmount()}
                    id="input-nominal"
                    name="input-nominal"
                    placeholder="Please enter discount nominal"
                    allowDecimals={false}
                    allowNegativeValue={false}
                    intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                    onValueChange={(value) => dispatch(onChangeDiscountNominal(value))}
                    hidden={discData.type !== 'nominal'}
                    value={discData.nominal || ''}
                />
                <CurrencyInput
                    className={handleErrorAmount()}
                    id="input-percentage"
                    name="input-percentage"
                    placeholder="Please enter discount percentage"
                    allowDecimals={false}
                    allowNegativeValue={false}
                    suffix="%"
                    min={0}
                    max={100}
                    value={isNaN(discData.percentage) ? '' : discData.percentage * 100}
                    onValueChange={(value) => dispatch(onChangeDiscountPercentage(value/100))}
                    hidden={discData.type === 'percentage' ? false : discData.type ?? false}
                />
                <p className="text-sm text-red-600" hidden={!errorAmount}>Discount amount is required!</p>
            </div>
            <div className="grid gap-2">
                <Label className="font-bold">Voucher Code</Label>
                <TextInput
                    color={errorVoucherCode || errorDuplicateVoucherCode ? 'failure' : ''}
                    placeholder="Voucher code"
                    onChange={(e) => { dispatch(onChangeVoucherCode(e.target.value.toUpperCase())); }}
                    value={discData.voucherCode || ''}
                />
                <p className="text-sm text-red-600" hidden={!errorVoucherCode}>Voucher code is required!</p>
                <p className="text-sm text-red-600" hidden={!errorDuplicateVoucherCode}>Voucher code already exist!</p>
            </div>
            <div className="grid gap-2">
            <Label className="font-bold">Limit</Label>
            <TextInput
            type="number" 
            min={0}
            placeholder="Please enter discount limit"
            onChange={(e) => dispatch(onChangeDiscountLimit(e.target.valueAsNumber))}
            value={discData.limit || ''}
            color={errorLimit && 'failure'}
            />
            <p className="text-sm text-red-600" hidden={!errorLimit}>Discount limit is required!</p>
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

export default FormDiscMinTransaction;