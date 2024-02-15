import LayoutDashboard from '../../components/LayoutDashboard';
import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import WidgetCategory from '../../components/widget/WidgetCategory';
import WidgetLatestProduct from '../../components/widget/WidgetLatestProduct';
import WidgetTopProduct from '../../components/widget/WidgetTopProduct';
import WidgetSalesReport from '../../components/widget/WidgetSalesReport';

const AdminDashboard = () => {
 
  return <>
    <LayoutDashboard>
      <LayoutPageAdmin title='Dashboard'> 
        <div className='grid gap-4 grid-rows-1 lg:grid-cols-3 mb-7'>
          <WidgetCategory/>
          <WidgetLatestProduct/>
          <WidgetTopProduct/>
        </div>
        <div className='grid grid-cols-1'>
          <WidgetSalesReport/>
        </div>
      </LayoutPageAdmin>
    </LayoutDashboard>
  </>
};

export default AdminDashboard;
