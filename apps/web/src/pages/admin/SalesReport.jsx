import { useEffect, useState } from "react";
import LayoutDashboard from "../../components/LayoutDashboard";
import LoadingSpinner from "../../components/LoadingSpinner";
import LayoutPageAdmin from "../../components/LayoutPageAdmin";
import { getMonthlySales } from "../../helpers/queryData";
import MonthlySalesReportChart from "../../components/report/MonthlySalesReportChart";
import SortBar from "../../components/SortBar";
import { useSelector } from "react-redux";
import API_CALL from "../../helpers/API";
import { useSearchParams } from "react-router-dom";
import MonthlySalesReportTable from "../../components/table/MonthlySalesReportTable";
import ResponsivePagination from "../../components/ResponsivePagination";
import { onPageChange } from "../../helpers/pagination";

const SalesReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [monthlySalesData, setMonthlySalesData] = useState(null);
  const [monthlySalesDataTable, setMonthlySalesDataTable] = useState(null);
  const currentUser = useSelector(state => state.userReducer);
  const [store, setStore] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    getStore();
    getMonthlySales(setMonthlySalesData, setIsLoading, {store: searchParams.get('store')});
    getMonthlySales(setMonthlySalesDataTable, setIsLoading, {store: searchParams.get('store'), limit: 5, page: searchParams.get('page')}, setTotalPage);
  }, [searchParams.get('store'), searchParams.get('page')])

  const getStore = async () => {
    try {
      setIsLoading(true);
      const resStore = await API_CALL.get('store', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setStore(resStore.data.result.raw);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterStore = (value) => {
    searchParams.set('store', value);
    setSearchParams(searchParams);
  };

  const storeOption = () => {
    return store && store.map((item, index) => {
      if (searchParams.get('store') === item.UUID) {
        return <option key={index} value={item.UUID} selected>{item.name}</option>
      }
      return <option key={index} value={item.UUID}>{item.name}</option>
    })
  };

  return <LayoutDashboard>
    <LoadingSpinner isLoading={isLoading} size={16} />
    <LayoutPageAdmin title='Sales Report'>
      <div>
        <SortBar title={'Store : '} onChange={(e) => handleFilterStore(e.target.value)} hidden={currentUser.role !== 'super'}>
          {storeOption()}
        </SortBar>
      </div>
      <div className="grid grid-cols-1">
        <div className="grid">
          <p className="text-center font-bold text-3xl">Monthly Sales Report</p>
          <div className="flex flex-col mt-4">
            <div className="min-h-[24rem] border rounded-md">
              {monthlySalesData && <MonthlySalesReportChart
                data={monthlySalesData.map((val) => { return { month: val.month, sales: val.salesTotal / 1000 } })}
                keys={'sales'}
                indexBy={'month'}
                leftLegend={'Revenue(K)'}
                bottomLegend={'Month'}
              />}
            </div>
            <div className="grid overflow-x-auto mt-5">
                <MonthlySalesReportTable
                data={monthlySalesDataTable}
                page={Number(searchParams.get('page')) || 1}
                />
            </div>
            <div className="mt-5">
            <ResponsivePagination
              currentPage={Number(searchParams.get('page')) || 1}
              onPageChange={(page) => onPageChange(page, setSearchParams)}
              totalPages={totalPage}
            />
          </div>
          </div>
        </div>
      </div>
    </LayoutPageAdmin>
  </LayoutDashboard>
};

export default SalesReport;