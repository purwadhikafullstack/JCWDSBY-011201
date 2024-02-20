import { Badge } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { HiChevronDown, HiMapPin, HiOutlineMapPin } from 'react-icons/hi2';
import API_CALL from '../helpers/API';
import { useDispatch } from 'react-redux';
import { setStore } from '../redux/slice/storeSlice';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';

const NearestSTore = ({ storeData }) => {
  const [storeList, setStoreList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getStoreList = async () => {
    try {
      const result = await API_CALL.get('/utils/store');
      setStoreList(result.data.result);
    } catch (error) {}
  };

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
    <>
      <div className="flex max-sm:flex-col gap-1 md:items-baseline">
        <div className="flex gap-1">
          <span className="font-normal text-sm text-gray-500">
            Nearest Store
          </span>
          <HiOutlineMapPin className="w-6 h-6 text-gray-500" />
        </div>
        <div
          className="flex gap-1 items-center relative cursor-pointer"
          onClick={() => setShowMore((prev) => !prev)}
        >
          <span className="font-semibold text-xs">{`${storeData.storeName}`}</span>
          <Badge
            color={`${storeData.distance ? `green` : `failure`}`}
            className="font-bold"
          >
            {storeData.distance
              ? `${(Number(storeData.distance) / 1000).toFixed(2)} KM`
              : `Out of Range`}
          </Badge>
          <HiChevronDown className="w-4 h-4" />
          <div
            className={`${showMore ? 'absolute top-8 z-50 w-full' : 'hidden'}`}
          >
            <div className="flex flex-col max-h-56 md:max-h-72 lg:max-h-96 gap-2 bg-white shadow-md overflow-auto rounded-md p-2 divide-y">
              {storeList &&
                storeList.map((val) => (
                  <div
                    key={val.UUID}
                    className="flex gap-1 items-center p-1 cursor-pointer"
                    onClick={() => {
                      console.log(val);
                      const payload = {
                        UUID: val.UUID,
                        name: val.name,
                        address: val.address,
                        postalCode: val.postalCode,
                        district: val.district.districtName,
                        city: val.city.cityName,
                        province: val.province.provinceName,
                        distance: null,
                        lat: val.lat,
                        lon: val.lon,
                      };
                      setIsLoading(true);
                      dispatch(setStore(payload));
                      navigate('/');
                      setTimeout(() => {
                        setIsLoading(false);
                      }, 1000);
                    }}
                  >
                    <HiOutlineMapPin className="w-6 h-6 text-gray-500" />
                    <span className="font-semibold text-xs">{`${val.name}`}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Loader isLoading={isLoading} />
    </>
  );
};

export default NearestSTore;
