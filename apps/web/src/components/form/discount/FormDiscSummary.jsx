import { Label, Button } from "flowbite-react";
import capitalize from "../../../helpers/capitalize";
import { useSelector } from "react-redux";

const FormDiscSummary = ({
    onBack,
    onCreate,
    hidden,
    storeData,
    productData,
}) => {
    const discData = useSelector((state) => state.discountReducer);

    const discTerm = (term) =>{
        if(term === 'buy 1 get 1') return 'Buy 1 Get 1';
        if(term === 'product') return 'Product Discount';
        if(term === 'min transaction') return 'Discount with Minimum Transaction';
    };

    const handleHiddenElement = () => {
        if(discData.term !== 'product' && discData.term !== 'min transaction') return 'hidden'
    };

    const handleHiddenProduct = () => {
        if(!productData.length) return 'hidden'
        if(discData.term === 'min transaction') return 'hidden'
    };

    const handleDiscountAmount = () => {
        if(discData.type === 'percentage') return discData.percentage ? `${discData.percentage*100} %` : '-';
        if(discData.type === 'nominal') return discData.nominal ? discData.nominal.toLocaleString('id-Id', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0}) : '-';
        return '-'
    };

    return <div hidden={hidden}>
        <h1 className="text-2xl font-extrabold text-center mb-5">Summary</h1>
        <div className="grid gap-4">
            <div className="grid gap-1">
                <Label className="font-bold">Name</Label>
                <p>{discData.name}</p>
            </div>
            <div className="grid gap-1">
                <Label className="font-bold">Discount Term</Label>
                <p>{discTerm(discData.term)}</p>
            </div>
            <div className="grid gap-1">
                <Label className="font-bold">Store</Label>
                <p>{storeData && storeData.find((val) => discData.storeId === val.UUID).name }</p>
            </div>
            <div className={`grid gap-1 ${productData && handleHiddenProduct()}`}>
                <Label className="font-bold" >Product</Label>
                <p>{productData && productData.length && productData.find((val) => discData.inventoryId == val.id)?.product.name}</p>
            </div>
            <div className={`grid gap-1 ${discData.term === 'min transaction' ? '' : 'hidden'}`}>
                <Label className="font-bold">Minimum Transaction</Label>
                <p>{discData.minTransaction.toLocaleString('id-Id', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0}) || '-'}</p>
            </div>
            <div className={`grid gap-1 ${handleHiddenElement()}`}>
                <Label className="font-bold">Discount Type</Label>
                <p>{discData.type && capitalize(discData.type)}</p>
            </div>
            <div className={`grid gap-1 ${handleHiddenElement()}`}>
                <Label className="font-bold">Discount Amount</Label>
                <p>{handleDiscountAmount()}</p>
            </div>
            <div className={`grid gap-1 ${discData.term === 'min transaction' ? '' : 'hidden'}`}>
                <Label className="font-bold">Discount Limit</Label>
                <p>{discData.limit || '-'}</p>
            </div>
            <div className={`grid gap-1`}>
                <Label className="font-bold">Start Time</Label>
                <p>{new Date(discData.startTime).toLocaleDateString('en-EN', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
            </div>
            <div className={`grid gap-1`}>
                <Label className="font-bold">End Time</Label>
                <p>{new Date(discData.endTime).toLocaleDateString('en-EN', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
            </div>
        </div>
        <div className="flex justify-between mt-6 mb-4">
            <Button color="blue" onClick={onBack}>Back</Button>
            <Button color="blue" onClick={onCreate}>Save</Button>
        </div>
    </div>
}

export default FormDiscSummary;