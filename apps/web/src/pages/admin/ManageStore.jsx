import AdminSidebar from "../../components/AdminSidebar";
import LayoutPageAdmin from "../../components/LayoutPageAdmin";

const ManageStore = () => {
    return <>
        <div className='flex flex-row container bg-slate-200 min-w-[360px] h-max min-h-screen'>
            <AdminSidebar />
            <LayoutPageAdmin title='Manage Store'>

            </LayoutPageAdmin>
        </div>
    </>
};

export default ManageStore;