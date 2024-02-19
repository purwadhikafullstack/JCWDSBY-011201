import { useEffect, useState } from "react";
import { ResponsivePie } from '@nivo/pie';
import API_CALL from "../../helpers/API";
import WidgetLayoutBox from "./WidgetLayoutBox";
import { useSelector } from "react-redux";
import SortBar from "../SortBar";

const WidgetTopProduct = () => {
  const currentUser = useSelector(state => state.userReducer);
  const [topProductData, setTopProductData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');

  useEffect(() => {
    getStore();
    if (selectedStore) getTopProduct();
  }, [selectedStore])

  const getTopProduct = async () => {
    try {
      const res = await API_CALL.get('report/sales/top-product', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        params: {
          limit: 3,
          store: selectedStore
        }
      });
      setTopProductData(res.data.result);
    } catch (error) {
      console.error(error);
    }
  };

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

  return <WidgetLayoutBox title={'Top Product'}>
    {topProductData.length ?
      <ResponsivePie
        data={topProductData.map((val) => {
          const productName = val.productName?.split(' ')[0] + ' ' + val.productName?.split(' ')[1]
          return { id: val.id, label: productName, value: val.totalAmount }
        })}
        margin={{ top: 10, right: 80, bottom: 100, left: 100 }}
        innerRadius={0.7}
        padAngle={0.7}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'nivo' }}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [
            [
              'darker',
              0.2
            ]
          ]
        }}
        arcLabel={'value'}
        enableArcLinkLabels={false}
        legends={[
          {
            anchor: 'bottom-left',
            direction: 'column',
            justify: false,
            translateX: -80,
            translateY: 40,
            itemWidth: 100,
            itemHeight: 20,
            itemsSpacing: 0,
            symbolSize: 20,
            itemDirection: 'left-to-right'
          }
        ]}
      />
      :
      <div className="ml-5">
        <span>Data not available!</span>
      </div>
    }
    <div className={`absolute bottom-3 flex items-center gap-2 px-5`}>
      <SortBar onChange={(e) => setSelectedStore(e.target.value)} title={'Store :'} hidden={currentUser.role !== 'super'}>
        {storeData && storeData.map((item, index) => <option key={index} value={item.UUID}>{item.name}</option>)}
      </SortBar>
    </div>
  </WidgetLayoutBox>
};

export default WidgetTopProduct;