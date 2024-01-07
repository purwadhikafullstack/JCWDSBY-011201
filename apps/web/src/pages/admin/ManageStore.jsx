import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import LayoutPageAdmin from "../../components/LayoutPageAdmin";
import LoadingSpinner from "../../components/LoadingSpinner";

const ManageStore = () => {
    const [isLoading, setIsLoading] = useState(false);

    return <>
        <div className='flex flex-row container bg-slate-200 min-w-[360px] h-max min-h-screen'>
            <AdminSidebar />
            <LoadingSpinner isLoading={isLoading} size={16}/>
            <LayoutPageAdmin title='Manage Store'>

            </LayoutPageAdmin>
        </div>
    </>
};

export default ManageStore;