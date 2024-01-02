import LoadingSpinner from "../../components/LoadingSpinner";
import TopBar from "../../components/TopBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Label, TextInput } from "flowbite-react";

const EditProduct = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({ size: false, type: false, requiredFieldFile: false });
    const [requiredField, setRequiredField] = useState({name: false, weight: false, price: false});
    const [data, setData] = useState({
        name: null,
        price: null,
        description: null,
        weight: null,
        categoryId: null,
        image: null
    });

    return <>
        <div className='flex flex-col container bg-slate-200 min-w-[360px] h-max min-h-screen'>
            <TopBar title='Edit Product' prevPage={() => navigate('/manage/product')} />
            <LoadingSpinner size={16} isLoading={isLoading} />
            <form className={`border border-black p-3 ${isLoading && 'hidden'}`}>
                <div className='grid gap-2 mb-3'>
                    <Label value='Product Name' />
                    <TextInput placeholder='Product Name'/>
                    {/* <TextInput placeholder='Product Name' onChange={(e) => { setData({ ...data, name: e.target.value }); setRequiredField({ ...requiredField, name: false }) }} color={requiredField.name && 'failure'} helperText={requiredField.name && 'Name is required'} required /> */}
                </div>

            </form>
        </div>
    </>
}

export default EditProduct;