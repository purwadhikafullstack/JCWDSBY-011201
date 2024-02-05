import Footer from '../components/Footer';
import UserLayout from '../components/UserLayout';
import UserProductCard from '../components/UserProductCard';
import { useSelector } from 'react-redux';
import NearestSTore from '../components/NearestStore';
import API_CALL from '../helpers/API';
import { useEffect, useState } from 'react';
import HeroViews from '../components/views/HeroViews';
import LandingCategoryViews from '../components/views/LandingCategoryViews';
import { useNavigate } from 'react-router-dom';
import ButtonSeeAll from '../components/ButtonSeeAll';
import HeroFooter from '../components/views/HeroFooterViews';
import { Button } from 'flowbite-react';
import MiniHeroViews from '../components/views/MiniHeroVIews';
import { discountPrice, promo } from '../helpers/discount';

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
      setCategoryData(res.data);
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
        store: currStore.storeId, limit: 'none'
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
            <div className=" flex flex-col lg:flex-row gap-1 lg:gap-3">
              <span className="font-bold text-2xl lg:text-4xl text-gray-700">
                Special
              </span>
              <span className="font-bold text-2xl lg:text-4xl text-blue-700">
                Promos
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row w-full place-items-center gap-4 lg:gap-6">
              {productData.map((value, index) => (
                <UserProductCard
                  key={index}
                  image={`${import.meta.env.VITE_IMG_URL}/product/${
                    value.product.product_images[0].image
                  }`}
                  category={value.product.category.name}
                  inventoryid={value.id}
                  productName={value.product.name}
                  productUnit={value.product.weight + value.product.unit}
                  price={value.product.price}
                  discountPrice={discountPrice(value)}
                  isPromo={promo(value)}
                  stock={value.stock}
                  onClickProduct={() => {
                    navigate(`/product/${value.product.name}`);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row w-full place-items-center gap-4 lg:gap-6">
              {productData.map((value, index) => (
                <UserProductCard
                  key={index}
                  image={`${import.meta.env.VITE_IMG_URL}/product/${
                    value.product.product_images[0].image
                  }`}
                  category={value.product.category.name}
                  inventoryid={value.id}
                  productName={value.product.name}
                  productUnit={value.product.weight + value.product.unit}
                  price={value.product.price}
                  discountPrice={discountPrice(value)}
                  isPromo={promo(value)}
                  stock={value.stock}
                  onClickProduct={() => {
                    navigate(`/product/${value.product.name}`);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </UserLayout>
  );
};

export default Landing;
