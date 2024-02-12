import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import LayoutPageAdmin from "../../components/LayoutPageAdmin";
import StockReportTable from "../../components/table/StockReportTable";
import SearchBar from "../../components/SearchBar";
import SortBar from "../../components/SortBar";
import { sortingStockReport } from "../../constants/sorting";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getStockReport, getStore } from "../../helpers/queryData";
import ResponsivePagination from "../../components/ResponsivePagination";
import LayoutDashboard from "../../components/LayoutDashboard";

const StockReport = () => {
  const currentUser = useSelector(state => state.userReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [stockReportData, setStockReportData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    getStockReport(searchParams, setStockReportData, setTotalPage)
    getStore(setStoreData, setIsLoading)
  }, [searchParams])

  const handleFilterStore = (value) => {
    if (value === 'all') {
      searchParams.delete('store');
      searchParams.set('page', 1);
      return setSearchParams(searchParams)
    }
    searchParams.set('store', value);
    searchParams.set('page', 1);
    setSearchParams(searchParams)
  };

  const onPageChange = (page) => {
    setSearchParams((prev) => {
      prev.set('page', page);
      return prev;
    });
  };

  return <>
    <LayoutDashboard>
      <LoadingSpinner isLoading={isLoading} size={16} />
      <LayoutPageAdmin title='Stock Report'>
        <div className='grid grid-cols-1 overflow-x-auto '>
          <div className='flex flex-col gap-3 justify-between lg:items-center lg:flex-row my-3'>
            <div className='flex flex-col gap-4 lg:flex-row'>
              <SortBar
                title={'Store :'}
                onChange={(e) => handleFilterStore(e.target.value)} hidden={currentUser.role !== 'super' ? true : false}
              >
                <option value={'all'}>All</option>
                {storeData && storeData.map((val, index) => {
                  if (searchParams.get('store') === val.UUID) {
                    return <option key={index} value={val.UUID} selected>{val.name}</option>
                  }
                  return <option key={index} value={val.UUID}>{val.name}</option>
                })}
              </SortBar>
              <SortBar
                title={'Sort :'}
                onChange={(e) => { searchParams.set('sort', e.target.value); searchParams.set('page', 1); setSearchParams(searchParams); }}
                defaultValue={searchParams.get('sort')}
              >
                {sortingStockReport.map((value, index) => { return <option key={index} value={value.value}>{value.sortName}</option> })}
              </SortBar>
            </div>
            <SearchBar
              placeholder={'Search Product Name'}
              onChange={(e) => {
                setTimeout(() => {
                  setSearchParams((prev) => {
                    if (e.target.value) {
                      prev.set('q', e.target.value);
                      searchParams.set('page', 1);
                    } else {
                      prev.delete('q');
                      searchParams.set('page', 1);
                    }
                    return prev;
                  });
                }, 1000);
              }}
            />
          </div>
          <StockReportTable data={stockReportData} />
          <div className="mt-5">
            <ResponsivePagination
              currentPage={Number(searchParams.get('page')) || 1}
              onPageChange={onPageChange}
              totalPages={totalPage}
            />
          </div>
        </div>
      </LayoutPageAdmin>
    </LayoutDashboard>
  </>
};

export default StockReport;