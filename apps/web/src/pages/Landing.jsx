import Footer from '../components/Footer';
import UserLayout from '../components/UserLayout';
import { useSelector } from 'react-redux';
import NearestSTore from '../components/NearestStore';
import API_CALL from '../helpers/API';
import { useEffect, useState } from 'react';
import HeroViews from '../components/views/HeroViews';
import LandingCategoryViews from '../components/views/LandingCategoryViews';
import { useNavigate } from 'react-router-dom';
import ButtonSeeAll from '../components/ButtonSeeAll';
import HeroFooter from '../components/views/HeroFooterViews';
import MiniHeroViews from '../components/views/MiniHeroVIews';
import LandingProductViews from '../components/views/LandingProductViews';

const Landing = () => {
  const currStore = useSelector((reducer) => reducer.storeReducer);
  const [categoryData, setCategoryData] = useState(null);
  const [heroData, setHeroData] = useState(null);
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    getCategoryData();
    if (currStore.storeId) getProductData();
    getHeroData();
  }, [currStore]);

  const getCategoryData = async () => {
    const res = await API_CALL.get('category');
    if (res) {
      setCategoryData(res.data.result.rows);
    }
  };

  const getHeroData = async () => {
    try {
      const hero = await API_CALL.get('/event');
      setHeroData(hero.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductData = async () => {
    const res = await API_CALL.get('inventory', {
      params: {
        store: currStore.storeId,
        limit: 10,
      },
    });
    if (res) {
      setProductData(res.data.result.rows);
    }
  };

  return (
    <UserLayout>
      <div className="flex flex-col w-full px-4 lg:px-32 flex-grow gap-4 pt-4 lg:gap-8 mb-4">
        <div className="flex lg:hidden w-full">
          <NearestSTore storeData={currStore} />
        </div>
        <HeroViews heroData={heroData} />
        <HeroFooter />
        <div className="flex flex-col gap-2 lg:gap-8 lg:py-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-3">
              <span className="font-bold text-2xl lg:text-4xl text-gray-700">
                Browse Our
              </span>
              <span className="font-bold text-2xl lg:text-4xl text-blue-700">
                Categories
              </span>
            </div>
            <ButtonSeeAll
              onClick={() =>
                navigate('/category', {
                  state: { previousPath: location.pathname },
                })
              }
            />
          </div>
          <LandingCategoryViews categoryData={categoryData} />
        </div>
        <MiniHeroViews />
        <div className="flex flex-col gap-2 lg:gap-8 lg:py-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-3">
              <span className="font-bold text-2xl lg:text-4xl text-gray-700">
                Products From
              </span>
              <span className="font-bold text-2xl lg:text-4xl text-blue-700">
                {currStore.storeName}
              </span>
            </div>
            <ButtonSeeAll
              onClick={() =>
                navigate('/category', {
                  state: { previousPath: location.pathname },
                })
              }
            />
          </div>
          <div className="flex w-full">
            <LandingProductViews productData={productData} />
          </div>
        </div>
      </div>
      <Footer />
    </UserLayout>
  );
};

export default Landing;
