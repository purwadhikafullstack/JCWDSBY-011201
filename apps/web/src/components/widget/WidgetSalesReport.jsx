import { useEffect, useState } from "react";
import API_CALL from "../../helpers/API";
import { getMonthlySales } from "../../helpers/queryData";
import MonthlySalesReportChart from "../report/MonthlySalesReportChart";
import SortBar from "../SortBar";
import { useSelector } from "react-redux";

const WidgetSalesReport = () => {
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const currentUser = useSelector(state => state.userReducer);

  useEffect(() => {
    getStore();
    if (selectedStore) getMonthlySales(setMonthlySalesData, null, { store: selectedStore })
  }, [selectedStore])

  const getStore = async () => {
    try {
      const resStore = await API_CALL.get('store', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setStoreData(resStore.data.result.raw);
      if (!selectedStore) setSelectedStore(resStore.data.result.raw[0].UUID);
    } catch (error) {
      console.error(error);
    }
  };

  return <div className="border-2 h-80 lg:h-96 rounded-md shadow-lg mb-10">
    <div className="h-[15%] flex justify-center items-center">
      <p className='font-bold text-2xl lg:text-3xl'>Sales Report</p>
    </div>
    <div className='h-[85%] relative'>
      <div className="ml-5 absolute z-20">
        <SortBar onChange={(e) => setSelectedStore(e.target.value)} title={'Store :'} hidden={currentUser.role !== 'super'}>
          {storeData && storeData.map((item, index) => <option key={index} value={item.UUID}>{item.name}</option>)}
        </SortBar>
      </div>
      {monthlySalesData.length ? <MonthlySalesReportChart
        data={monthlySalesData.map((val) => { return { month: val.month, sales: val.salesTotal / 1000 } })}
        keys={'sales'}
        indexBy={'month'}
        leftLegend={'Revenue(K)'}
        bottomLegend={'Month'}
      />
        :
        <div className="ml-5 pt-16">
          <span>Data not available!</span>
        </div>
      }
    </div>
  </div>
};

export default WidgetSalesReport;