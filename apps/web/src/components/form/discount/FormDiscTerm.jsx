import { Label, Select,  Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { onChangeDiscountTerm } from "../../../redux/slice/discountSlice";

const FormDiscTerm = ({
    onNext,
    hidden,
}) => {
    const dispatch = useDispatch();
    const discountTerm = useSelector((state) => state.discountReducer.term);

    return <div hidden={hidden}>
        <form className="grid gap-2">
            <Label className="font-bold">Discount Term</Label>
            <Select onChange={(e) => dispatch(onChangeDiscountTerm({term: e.target.value}))} value={discountTerm || 'buy 1 get 1'} >
                <option value={'buy 1 get 1'}>Buy 1 Get 1</option>
                <option value={'product'}>Product Discount</option>
                <option value={'min transaction'}>Discount with Minimum Transaction</option>
            </Select>
        </form>
        <div className="grid justify-end mt-6 mb-4">
            <Button color="blue" onClick={onNext}>Next</Button>
        </div>
    </div>
};

export default FormDiscTerm;