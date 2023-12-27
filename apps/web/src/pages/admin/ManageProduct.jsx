import AdminSidebar from "../../components/AdminSidebar";
import LayoutPageAdmin from "../../components/LayoutPageAdmin";
import BoxAddItem from "../../components/BoxAddItem";
import { useNavigate } from "react-router-dom";

const ManageProduct = () => {
    const navigate = useNavigate();
    return <>
        <div className='flex flex-row container bg-slate-200 min-w-[360px] h-max min-h-screen'> 
            <AdminSidebar />
            <LayoutPageAdmin title='Manage Product'>
                <div className='flex flex-wrap justify-between gap-y-5'>
                <BoxAddItem title='Add Product' onClick={() => navigate('/manage/product/create')}/>
                </div>
            </LayoutPageAdmin>
        </div>
    </>
};

export default ManageProduct;