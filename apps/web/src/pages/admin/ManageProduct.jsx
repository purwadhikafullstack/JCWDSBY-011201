import AdminSidebar from "../../components/AdminSidebar";
import LayoutPageAdmin from "../../components/LayoutPageAdmin";
import BoxAddItem from "../../components/BoxAddItem";
import { useNavigate } from "react-router-dom";
import CardManage from "../../components/CardManage";
import { useEffect, useState } from "react";
import API_CALL from "../../helpers/API";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSelector } from "react-redux";
import { IMG_URL_PRODUCT } from "../../constants/imageURL";
import CardManageProduct from "../../components/CardManageProduct";

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
        const res = await API_CALL.get('product/inventory');
        if (res) {
            setData(res.data);
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
                                image={item.product.product_images[0].image && IMG_URL_PRODUCT + item.product.product_images[0].image}
                                productName={item.product.name}
                                productUnit={item.product.weight + item.product.unit}
                                price={item.product.price}
                                stock={item.stock}
                                onEdit={() => navigate(`/manage/product/edit/${item.product.name}`)}
                                onDelete={() => handleDeleteButton(item.product.id)}
                            />
                            // <CardManage
                            //     key={index}
                            //     src={item.product_images[0].image? IMG_URL_PRODUCT + item.product_images[0].image : '/defaultImage.jpg'}
                            //     name={item.name}
                            //     onEdit={() => navigate(`/manage/product/edit/${item.name}`)}
                            //     onDelete={() => handleDeleteButton(item.id)}
                            // />
                        )
                    })}
                </div>
            </LayoutPageAdmin>
        </div>
    </>
};

export default ManageProduct;