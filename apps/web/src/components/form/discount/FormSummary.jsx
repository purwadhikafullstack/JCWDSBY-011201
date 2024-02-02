import { Label, Button } from "flowbite-react";
import capitalize from "../../../helpers/capitalize"

const FormSummary = ({
    onBack,
    onCreate,
    hidden,
    summaryData,
    storeData,
    productData,
    discAmount,
    minTransactionAmount,
}) => {
    const discTerm = (term) =>{
        if(term === 'buy 1 get 1') return 'Buy 1 Get 1';
        if(term === 'product') return 'Product Discount';
        if(term === 'min transaction') return 'Discount with Minimum Transaction';
    };

    const handleHiddenElement = () => {
        if(summaryData.term !== 'product' && summaryData.term !== 'min transaction') return 'hidden'
    };
    const handleHiddenProduct = () => {
        if(!productData.length) return 'hidden'
        if(summaryData.term === 'min transaction') return 'hidden'
    };

    return <div hidden={hidden}>
        <h1 className="text-2xl font-extrabold text-center mb-5">Summary</h1>
        <div className="grid gap-4">
            <div className="grid gap-1">
                <Label className="font-bold">Name</Label>
                <p>{summaryData && summaryData.name}</p>
            </div>
            <div className="grid gap-1">
                <Label className="font-bold">Discount Term</Label>
                <p>{summaryData && discTerm(summaryData.term)}</p>
            </div>
            <div className="grid gap-1">
                <Label className="font-bold">Store</Label>
                <p>{summaryData && storeData && storeData.find((val) => summaryData.storeId === val.UUID).name }</p>
            </div>
            <div className={`grid gap-1 ${productData && handleHiddenProduct()}`}>
                <Label className="font-bold" >Product</Label>
                <p>{summaryData && productData && productData.length && productData.find((val) => summaryData.inventoryId == val.id)?.product.name}</p>
            </div>
            <div className={`grid gap-1 ${summaryData && summaryData.term === 'min transaction' ? '' : 'hidden'}`}>
                <Label className="font-bold">Minimum Transaction</Label>
                <p>{minTransactionAmount || '-'}</p>
            </div>
            <div className={`grid gap-1 ${summaryData && handleHiddenElement()}`}>
                <Label className="font-bold">Discount Type</Label>
                <p>{summaryData && capitalize(summaryData.type)}</p>
            </div>
            <div className={`grid gap-1 ${summaryData && handleHiddenElement()}`}>
                <Label className="font-bold">Discount Amount</Label>
                <p>{discAmount || '-'}</p>
            </div>
            <div className={`grid gap-1 ${summaryData && summaryData.term === 'min transaction' ? '' : 'hidden'}`}>
                <Label className="font-bold">Discount Limit</Label>
                <p>{summaryData && summaryData.limit || '-'}</p>
            </div>
            <div className={`grid gap-1`}>
                <Label className="font-bold">Start Time</Label>
                <p>{summaryData && new Date(summaryData.startTime).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
            </div>
            <div className={`grid gap-1`}>
                <Label className="font-bold">End Time</Label>
                <p>{summaryData && new Date(summaryData.endTime).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
            </div>
        </div>
        <div className="flex justify-between mt-6 mb-4">
            <Button color="blue" onClick={onBack}>Back</Button>
            <Button color="blue" onClick={onCreate}>Create</Button>
        </div>
    </div>
}

export default FormSummary;