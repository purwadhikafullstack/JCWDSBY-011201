import AdminSidebar from "../../components/AdminSidebar";
import LayoutPageAdmin from "../../components/LayoutPageAdmin";
import BoxAddItem from "../../components/BoxAddItem";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_CALL from "../../helpers/API";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSelector } from "react-redux";
import { IMG_URL_PRODUCT } from "../../constants/imageURL";
import CardManageProduct from "../../components/CardManageProduct";
import capitalize from "../../helpers/capitalize";

const ManageProduct = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const currentUserRole = useSelector((reducer) => reducer.userReducer.role);

    useEffect(() => {
        getProduct();
    }, []);

    const getProduct = async () => {
        setIsLoading(true);
        const res = await API_CALL.get('product');
        if (res) {
            setData(res.data.result.data);
            setIsLoading(false);
        }
    };

    const handleDeleteButton = async (id) => {
        await API_CALL.delete(`product/${id}`);
        getProduct();
    };

    return <>
        <div className='flex flex-row container bg-blue-100 min-w-[360px] h-max min-h-screen'>
            <AdminSidebar />
            <LoadingSpinner isLoading={isLoading} size={16} />
            <LayoutPageAdmin title='Manage Product'>
                <div className='grid grid-cols-2 gap-5 lg:grid-cols-7'>
                    {currentUserRole === 'super' && <BoxAddItem title='Add Product' onClick={() => navigate('/manage/product/create')} />}
                    {data && data.map((item, index) => {
                        return (
                            <CardManageProduct
                                key={index}
                                image={item.product_images[0].image && IMG_URL_PRODUCT + item.product_images[0].image}
                                productName={capitalize(item.name)}
                                productUnit={item.weight + item.unit}
                                price={item.price}
                                onEdit={() => navigate(`/manage/product/edit/${item.name}`)}
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