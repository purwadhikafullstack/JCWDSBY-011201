import { Label, Select, Radio, Button, Datepicker, TextInput } from "flowbite-react";
import CurrencyInput from "react-currency-input-field";
import { useState } from "react";
import { customButton } from "../../../helpers/flowbiteCustomTheme";
import { useSelector } from "react-redux";

const FormDiscountMinTransaction = ({
    hidden,
    errorAmount,
    errorMinTransaction,
    onNext,
    onBack,
    storeData,
    onChangeName,
    onChangeLimit,
    onChangeStore,
    onChangeDiscountType,
    onChangeDiscountAmount,
    onChangeMinTransaction,
    onChangeStartTime,
    onChangeEndTime,
    onChangeVoucherCode,
    percentageValue,
    nominalValue,
    minTransactionValue,
    defaultDiscountType,
    startDateValue,
    errorDate,
    errorVoucherCode,
    errorDuplicateVoucherCode,
    errorName,
    errorLimit,
}) => {
    const [voucherCode, setVoucherCode] = useState();
    const currentUserRole = useSelector((reducer) => reducer.userReducer.role);

    const handleErrorAmount = () => {
        if (errorAmount) return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500"
        return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
    };

    const handleErrorMinTransaction = () => {
        if (errorMinTransaction) return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500"
        return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
    };

    return <div hidden={hidden}>
        <h1 className="text-2xl font-extrabold text-center mb-5">Discount with Minimum Transaction</h1>
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
                <Label className="font-bold">Minimum Transaction</Label>
                <CurrencyInput
                    className={handleErrorMinTransaction()}
                    id="input-minTransaction"
                    name="input-minTransaction"
                    placeholder="Please enter minimum transaction"
                    allowDecimals={false}
                    allowNegativeValue={false}
                    intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                    onValueChange={(value, name, values) => onChangeMinTransaction(values)}
                    value={minTransactionValue}
                />
                <p className="text-sm text-red-600" hidden={!errorMinTransaction}>Minimum Transaction Amount is required!</p>
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
                    className={handleErrorAmount()}
                    id="input-nominal"
                    name="input-nominal"
                    placeholder="Please enter discount nominal"
                    allowDecimals={false}
                    allowNegativeValue={false}
                    intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
                    onValueChange={(value, name, values) => onChangeDiscountAmount(value, name, values)}
                    hidden={defaultDiscountType !== 'nominal'}
                    value={nominalValue}
                />
                <CurrencyInput
                    className={handleErrorAmount()}
                    id="input-percentage"
                    name="input-percentage"
                    placeholder="Please enter discount percentage"
                    allowDecimals={false}
                    allowNegativeValue={false}
                    suffix="%"
                    onValueChange={(value, name, values) => onChangeDiscountAmount(value, name, values)}
                    hidden={defaultDiscountType !== 'percentage'}
                    min={0}
                    max={100}
                    value={percentageValue && percentageValue * 100}
                />
                <p className="text-sm text-red-600" hidden={!errorAmount}>Discount amount is required!</p>
            </div>
            <div className="grid gap-2">
                <Label className="font-bold">Voucher Code</Label>
                <TextInput
                    color={errorVoucherCode || errorDuplicateVoucherCode ? 'failure' : ''}
                    placeholder="Voucher code"
                    onChange={(e) => { onChangeVoucherCode(e); setVoucherCode(e.target.value.toUpperCase()); }}
                    value={voucherCode}
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
            onChange={(e) => onChangeLimit(e)}
            color={errorLimit && 'failure'}
            />
            <p className="text-sm text-red-600" hidden={!errorLimit}>Discount limit is required!</p>
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
            <Button theme={customButton} color="primary" onClick={onBack}>Back</Button>
            <Button theme={customButton} color="secondary" onClick={onNext}>Next</Button>
        </div>
    </div>
};

export default FormDiscountMinTransaction;