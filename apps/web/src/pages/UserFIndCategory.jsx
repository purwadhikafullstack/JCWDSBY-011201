import Footer from '../components/Footer';
import UserCategoryButton from '../components/UserCategoryButton';
import UserLayout from '../components/UserLayout';
import UserProductCard from '../components/UserProductCard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API_CALL from '../helpers/API';
import { useEffect, useState } from 'react';
import { IMG_URL_CATEGORY, IMG_URL_PRODUCT } from '../constants/imageURL';
import { useSelector } from 'react-redux';
import { sortingProduct } from '../constants/sorting';
import { Select } from 'flowbite-react';
import FindCategoryViews from '../components/views/FindCategoryViews';
import { discountPrice, promo } from '../helpers/discount';

const UserFindCategory = () => {
  const currStore = useSelector((reducer) => reducer.storeReducer);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState(null);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    getCategoryData();
    if (currStore.storeId) getProductData();
  }, [currStore]);

  useEffect(() => {
    if (currStore.storeId) getProductData();
  }, [searchParams]);

  const getCategoryData = async () => {
    const res = await API_CALL.get('category');
    if (res) {
      setCategoryData(res.data.result.rows);
    }
  };

  const getProductData = async () => {
    const res = await API_CALL.get('inventory', {
      params: {
        q: searchParams.get('q'),
        category: searchParams.get('category'),
        sort: searchParams.get('sort'),
        store: currStore.storeId,
      },
    });
    if (res) {
      setProductData(res.data.result.rows);
    }
  };

  return (
    <UserLayout>
      <div className="flex flex-col w-full flex-grow p-4 lg:px-32 gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-2xl lg:text-4xl text-blue-700">Categories</span>
          <FindCategoryViews categoryData={categoryData} />
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-bold text-xl lg:text-2xl text-black">Sort By</span>
          <Select
            value={searchParams.get('sort') || sortingProduct[0].value}
            onChange={(e) => {
              searchParams.set('sort', e.target.value);
              setSearchParams(searchParams);
            }}
          >
            {sortingProduct.map((value, index) => (
              <option key={index} value={value.value}>
                {value.sortName}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold text-2xl lg:text-4xl text-blue-700">
            Products {searchParams.get('q') && `for "${searchParams.get('q')}"`}
          </span>
          <div className="flex w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row w-full place-items-center gap-4">
              {!productData.length && [1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex w-full justify-center items-center">
                  <div className="flex items-center justify-center  w-44 h-56 lg:w-48 lg:h-64 bg-gray-300 rounded-lg animate-pulse">
                    <svg
                      className="w-10 h-10 text-gray-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                  </div>
                </div>
              ))}
              {productData.map((value, index) => (
                <UserProductCard
                  key={index}
                  image={
                    IMG_URL_PRODUCT + value.product.product_images[0].image
                  }
                  productName={value.product.name}
                  productUnit={value.product.weight + value.product.unit}
                  price={value.product.price}
                  discountPrice={discountPrice(value)}
                  isPromo={promo(value)}
                  stock={value.stock}
                  onClickProduct={() =>
                    navigate(`/product/${value.product.name}`)
                  }
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

export default UserFindCategory;
