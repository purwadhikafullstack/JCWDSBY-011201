import { Label, Select,  Button } from "flowbite-react";
import { customButton } from "../../../helpers/flowbiteCustomTheme";

const FormDiscountTerm = ({
    onNext,
    onChange,
    hidden,
}) => {
    return <div hidden={hidden}>
        <form className="grid gap-2">
            <Label className="font-bold">Discount Term</Label>
            <Select onChange={(e) => onChange(e)}>
                <option value={'buy 1 get 1'}>Buy 1 Get 1</option>
                <option value={'product'}>Product Discount</option>
                <option value={'min transaction'}>Discount with Minimum Transaction</option>
            </Select>
        </form>
        <div className="grid justify-end mt-6 mb-4">
            <Button theme={customButton} color="primary" onClick={onNext}>Next</Button>
        </div>
    </div>
};

export default FormDiscountTerm;