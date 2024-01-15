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

const Landing = () => {
  const currStore = useSelector((reducer) => reducer.storeReducer);
  const [categoryData, setCategoryData] = useState(null);
  const [heroData, setHeroData] = useState(null);
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    getCategoryData();
    getProductData();
    getHeroData();
  }, []);

  const getCategoryData = async () => {
    const res = await API_CALL.get('category');
    // console.log('RES >>>', res.data);
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
    const res = await API_CALL.get('product/inventory');
    // console.log('RES >>>', res.data);
    if (res) {
      setProductData(res.data.result.data);
    }
  };

  return (
    <UserLayout>
      <div className="flex flex-col w-full flex-grow p-4 gap-4">
        <div className="flex w-full">
          <NearestSTore storeData={currStore} />
        </div>
        <HeroViews heroData={heroData} />
        <div className="flex flex-col gap-2">
          <span className="font-bold text-base">Categories</span>
          <LandingCategoryViews categoryData={categoryData} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold text-base">Special Promos</span>
          <div className="flex w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row w-full place-items-center gap-4">
              {productData.map((value, index) => (
                <UserProductCard
                  key={index}
                  image={`${import.meta.env.VITE_IMG_URL}/product/${
                    value.product.product_images[0].image
                  }`}
                  productName={value.product.name}
                  productUnit={value.product.weight + value.product.unit}
                  price={value.product.price}
                  discountPrice={7400}
                  stock={value.stock}
                  onClickProduct={() => {
                    navigate(`/product/${value.product.name}`);
                  }}
                />
              ))}
              {/* {product.map((value) => (
                <UserProductCard
                  key={value}
                  image={
                    'https://pppcoffee.com/cdn/shop/products/Chocolate_b22e9ffc-1fd7-41f9-8b88-6bac76eaf35d_1200x1200.jpg?v=1646977345'
                  }
                  productName={'Oatside Chocolate Barista Brew 250ML'}
                  productUnit={'250ML/Pcs'}
                  price={9000}
                  discountPrice={7400}
                  stock={49}
                />
              ))} */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </UserLayout>
  );
};

export default Landing;
