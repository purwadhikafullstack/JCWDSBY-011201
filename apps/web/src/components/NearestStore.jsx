import { Badge } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { HiMapPin, HiOutlineMapPin } from 'react-icons/hi2';
import API_CALL from '../helpers/API';

const NearestSTore = ({ storeData }) => {
  const [storeList, setStoreList] = useState(null);
  const getStoreList = async () => {
    try {
      const result = await API_CALL.get('/utils/store');
      setStoreList(result.data.result);
    } catch (error) {}
  };

  console.log(storeList);

  useEffect(() => {
    getStoreList();
  }, []);

  if (!storeData.storeName) {
    return (
      <div className="flex max-sm:flex-col gap-1 md:items-baseline">
        <div className="flex gap-1">
          <span className="font-normal text-sm text-gray-500">
            Nearest Store
          </span>
          <HiOutlineMapPin className="w-6 h-6 text-gray-500" />
        </div>
        <div className="h-3 animate-pulse w-24 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex max-sm:flex-col gap-1 md:items-baseline">
      <div className="flex gap-1">
        <span className="font-normal text-sm text-gray-500">Nearest Store</span>
        <HiOutlineMapPin className="w-6 h-6 text-gray-500" />
      </div>
      <div className="flex gap-1 items-baseline">
        <span className="font-semibold text-xs">{`${storeData.storeName}`}</span>
        <Badge
          color={`${storeData.distance ? `green` : `failure`}`}
          className="font-bold"
        >
          {storeData.distance
            ? `${(Number(storeData.distance) / 1000).toFixed(2)} KM`
            : `Out of Range`}
        </Badge>
      </div>
    </div>
  );
};

export default NearestSTore;
