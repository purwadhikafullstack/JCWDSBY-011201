import { useEffect, useState } from "react";
import API_CALL from "../../helpers/API";

const WidgetLatestProduct = () => {
  const [latestProductData, setLatestProductData] = useState([]);

  useEffect(() => {
    getLatestProduct();
  }, [])

  const getLatestProduct = async () => {
    const res = await API_CALL.get('product/latest', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      },
      params: {
        limit: 5
      }
    });
    setLatestProductData(res.data.result);
  };

  return <div className=" border-2 h-80 relative lg:h-96 rounded-md shadow-lg">
    <p className='text-center mt-4 font-bold text-2xl lg:text-3xl'>Latest Product</p>
    <div className="px-5 mt-10 text-lg lg:text-xl font-semibold gap-3 flex flex-col">
        {latestProductData && latestProductData.map((val, index) => {
          return <p key={index} className="line-clamp-1">{`${index + 1}. ${val.name}`}</p>
        })}
    </div>
  </div>
};

export default WidgetLatestProduct;