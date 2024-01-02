import AdminSidebar from "../../components/AdminSidebar";
import LayoutPageAdmin from "../../components/LayoutPageAdmin";
import BoxAddItem from "../../components/BoxAddItem";
import { useNavigate } from "react-router-dom";
import CardManage from "../../components/CardManage";
import { useEffect, useState } from "react";
import API_CALL from "../../helpers/API";

const ManageProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        getProduct();
    }, []);

    const getProduct = async () => {
        const res = await API_CALL.get('product');
        if(res){
            setProduct(res.data);
        }
    };

    const handleDeleteButton = async (id) => {
        await API_CALL.delete(`product/${id}`);
        getProduct();
    };

    return <>
        <div className='flex flex-row container bg-slate-200 min-w-[360px] h-max min-h-screen'>
            <AdminSidebar />
            <LayoutPageAdmin title='Manage Product'>
                <div className='flex flex-wrap justify-between gap-y-5'>
                    <BoxAddItem title='Add Product' onClick={() => navigate('/manage/product/create')} />
                    {product && product.map((item, index) => {
                        return (
                            <CardManage
                                key={index}
                                src={item.product_images[0].image? `${import.meta.env.VITE_IMG_URL}/product/${item.product_images[0].image}` : '/defaultImage.jpg'}
                                name={item.name}
                                // onEdit={() => navigate(`/manage/product/edit/${item.id}`)}
                                onDelete={() => handleDeleteButton(item.id)}
                            />
                        )
                    })}
                </div>
            </LayoutPageAdmin>
        </div>
    </>
};

export default ManageProduct;