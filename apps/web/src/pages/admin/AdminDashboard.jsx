import { useEffect, useState } from 'react';
import LayoutDashboard from '../../components/LayoutDashboard';
import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import WidgetCategory from '../../components/widget/WidgetCategory';
import { getCategory } from '../../helpers/queryData';
import API_CALL from '../../helpers/API';

const AdminDashboard = () => {
  // const [categoryData, setCategoryData] = useState(null);

  // useEffect(() => {
  //   getCategory(setCategoryData);
  // }, []) 

  const getTopProduct = () => {
    API_CALL.get('product/latest')
  }

  const data = [
    {
      "id": "stylus",
      "label": "stylus",
      "value": 1,
      "color": "hsl(358, 70%, 50%)"
    },
    {
      "id": "make",
      "label": "make",
      "value": 5,
      "color": "hsl(278, 70%, 50%)"
    },
  ]

  return <>
    <LayoutDashboard>
      <LayoutPageAdmin title='Dashboard'> 
      <div className='grid'>
        <div className='grid lg:grid-cols-3'>
          <WidgetCategory
          data={data}
          />
        </div>
      </div>
      </LayoutPageAdmin>
    </LayoutDashboard>
  </>
};

export default AdminDashboard;
