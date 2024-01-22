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

const UserFindCategory = () => {
  const currStore = useSelector((reducer) => reducer.storeReducer);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState(null);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    getCategoryData();
    if (currStore.storeId) getProductData();
  }, [currStore])

  useEffect(() => {
    if (currStore.storeId) getProductData();
  }, [searchParams])

  const getCategoryData = async () => {
    const res = await API_CALL.get('category');
    if (res) {
      setCategoryData(res.data);
    }
  };

  const getProductData = async () => {
    const res = await API_CALL.get('inventory', {
      params: { q: searchParams.get('q'), category: searchParams.get('category'), sort: searchParams.get('sort'), store: currStore.storeId },
    });
    if (res) {
      setProductData(res.data.result.data);
    }
  };

  return (
    <UserLayout>
      <div className="flex flex-col w-full flex-grow p-4 gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-base">Categories</span>
          <div className="flex w-full border-2 p-2 md:p-4 overflow-auto rounded-xl bg-blue-50">
            <div className="grid grid-rows-1 grid-flow-col gap-4">
              {categoryData && categoryData.map((value, index) => (
                <UserCategoryButton
                  key={index}
                  image={IMG_URL_CATEGORY + value.image}
                  categoryName={value.name}
                  isSelected={
                    searchParams.get('category') === value.name.toString()
                      ? true
                      : false
                  }
                  onClick={() => {
                    setSearchParams((prev) => {
                      if (prev.get('category') === value.name.toString()) {
                        prev.delete('category');
                      } else {
                        prev.set('category', value.name);
                      }
                      return prev;
                    });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm font-semibold">Sort By</span>
          <Select value={searchParams.get('sort') || sortingProduct[0].value} onChange={(e) => {searchParams.set('sort', e.target.value); setSearchParams(searchParams); }}>
            {sortingProduct.map((value, index) => <option key={index} value={value.value} >{value.sortName}</option>)}
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold text-base">
            Products {searchParams.get('q') && `for "${searchParams.get('q')}"`}
          </span>
          <div className="flex w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row w-full place-items-center gap-4">
              {productData && productData.map((value, index) => (
                <UserProductCard
                  key={index}
                  image={IMG_URL_PRODUCT + value.product.product_images[0].image}
                  productName={value.product.name}
                  productUnit={value.product.weight + value.product.unit}
                  price={value.product.price}
                  // discountPrice={7400}
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
