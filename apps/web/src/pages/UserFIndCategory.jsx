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
import { discountPrice, promo } from '../helpers/discount';
import ResponsivePagination from '../components/ResponsivePagination';
import { onPageChange } from "../helpers/pagination";
import LoadingSpinner from '../components/LoadingSpinner';

const UserFindCategory = () => {
  const currStore = useSelector((reducer) => reducer.storeReducer);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState(null);
  const [productData, setProductData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCategoryData();
    if (currStore.storeId) getProductData();
  }, [currStore]);

  useEffect(() => {
    if (currStore.storeId) getProductData();
  }, [searchParams, searchParams.get('page')]);

  const getCategoryData = async () => {
    setIsLoading(true);
    const res = await API_CALL.get('category');
    if (res) {
      setCategoryData(res.data.result.rows);
    }
    setIsLoading(false);
  };

  const getProductData = async () => {
    setIsLoading(true);
    const res = await API_CALL.get('inventory', {
      params: {
        q: searchParams.get('q'),
        category: searchParams.get('category'),
        sort: searchParams.get('sort'),
        store: currStore.storeId,
        limit: 10,
        page: searchParams.get('page'),
      },
    });
    if (res) {
      setTotalPage(Math.ceil(res.data.result.count / 10));
      setProductData(res.data.result.rows);
    }
    setIsLoading(false);
  };

  return (
    <UserLayout>
      <LoadingSpinner isLoading={isLoading} size={28} />
      <div className="flex flex-col w-full flex-grow p-4 lg:px-32 gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-2xl lg:text-4xl text-blue-700">Categories</span>
          <div className="flex w-full p-2 md:p-4 overflow-auto ">
            <div className="grid grid-rows-1 grid-flow-col gap-4">
              {categoryData &&
                categoryData.map((value, index) => (
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
              {!productData.length && <p>Product not available!</p>}
              {productData.map((value, index) => (
                <UserProductCard
                  key={index}
                  inventoryid={value.id}
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
          <div>
            <ResponsivePagination
              currentPage={Number(searchParams.get('page')) || 1}
              totalPages={totalPage}
              onPageChange={(page) => onPageChange(page, setSearchParams)}
            />
          </div>
        </div>
      </div>
      <Footer />
    </UserLayout>
  );
};

export default UserFindCategory;
