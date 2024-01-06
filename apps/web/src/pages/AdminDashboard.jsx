import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
  return <>
    <div className='flex flex-row container bg-slate-200 min-w-[360px] h-max min-h-screen'>
      <AdminSidebar />
      <h1>ini Dashboard Admin</h1>;
    </div>
  </>
};

export default AdminDashboard;
