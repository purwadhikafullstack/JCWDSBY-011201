import { Badge, Carousel } from 'flowbite-react';
import UserLayout from '../components/UserLayout';
import UserProductCard from '../components/UserProductCard';
import Footer from '../components/Footer';
import { HiOutlineShare } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import customToast from '../utils/toast';
import API_CALL from '../helpers/API';
import { IMG_URL_PRODUCT } from '../constants/imageURL';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSelector } from 'react-redux';
import { DrawerForUserProductCard } from '../components/DrawerForUserProductCard';
import { discountPrice, promo } from '../helpers/discount';

const UserProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currStore = useSelector((reducer) => reducer.storeReducer);
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [relatedProductData, setRelatedProductData] = useState([]);
  const [openDrawerDetails, setOpenDrawerDetails] = useState(false);
  const toggleDrawer = () => setOpenDrawerDetails((prevState) => !prevState);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      getProductData();
    }, 1000);
  }, [params.name]);
  const getProductData = async () => {
    const res = await API_CALL.get(
      `inventory/${location.pathname.split('/product/')[1]}`,
    );
    if (res) {
      setProductData(res.data.result);
      const relatedProduct = await API_CALL.get(
        `/inventory?store=${currStore.storeId}&category=${res.data.result.product.category.name}&limit=10`,
      ); //! need to change limit
      setRelatedProductData(
        relatedProduct.data.result.rows.filter(
          (item) => item.product.id !== res.data.result.product.id,
        ),
      );
    }
    setIsLoading(false);
  };
  // console.log('productData', productData.product.price);
  return (
    <UserLayout>
      <LoadingSpinner isLoading={isLoading} size={16} />
      <div className="flex flex-col gap-2 lg:w-[1024px] m-auto relative">
        <div className="h-96 md:h-[28rem] bg-blue-50">
          <Carousel>
            {productData &&
              productData.product.product_images.map((value, index) => (
                <img
                  key={index}
                  className="w-full h-full md:object-contain"
                  src={IMG_URL_PRODUCT + value.image}
                />
              ))}
          </Carousel>
        </div>
        <div className="flex p-2 flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-bold line-clamp-2">
                {productData && productData.product.name}
              </span>
              <div className="flex">
                {productData && discountPrice(productData) ? (
                  <div className="flex gap-2 items-baseline">
                    <span className="font-bold text-xl md:text-2xl text-blue-800">
                      {discountPrice(productData).toLocaleString('ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <span className="text-base text-red-500 line-through">
                      {productData?.productPrice.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <div className="flex">
                      {promo(productData) && (
                        <Badge color={'success'}>Buy 1 Get 1</Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 items-baseline">
                    <span className="text-xl font-bold">
                      {productData?.productPrice.toLocaleString('ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <div className="flex">
                      {promo(productData) && (
                        <Badge color={'success'}>Buy 1 Get 1</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className="flex w-12 h-12 p-1 justify-center items-center border-2 bg-blue-50 rounded-2xl cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                customToast('success', 'Product link copied to clipboard');
              }}
            >
              <HiOutlineShare size={'100'} />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-base font-semibold">Product description</span>
            <p className="text-base font-light">
              {productData && productData.product.description}
            </p>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold">Product units</span>
            <p className="text-base font-light">
              {productData &&
                `${productData.product.weight}${productData.product.unit}`}
            </p>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold">Product category</span>
            <p className="text-base font-light">
              {productData && productData.product.category.name}
            </p>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold">Product stock</span>
            <p className="text-base font-light">
              {productData && productData.stock}
            </p>
          </div>
        </div>
        <div className="flex flex-col w-full p-2 gap-2">
          <span className="text-lg font-bold">Related products</span>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row w-full place-items-center gap-4">
            {relatedProductData.map((value, index) => (
              <UserProductCard
                key={index}
                image={IMG_URL_PRODUCT + value.product.product_images[0].image}
                productName={value.product.name}
                productUnit={value.product.weight + value.product.unit}
                price={value.product.price}
                inventoryid={value.id}
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
        <div className="sticky w-full bottom-0 max-sm:bottom-[4.5rem]">
          <div className="flex w-full justify-between items-center px-5 py-3 bg-blue-50">
            <div className="flex">
              {productData && discountPrice(productData) ? (
                <div className="flex gap-2 items-center">
                  <span className="text-white text-base font-semibold bg-blue-800 p-1 rounded-md">
                    {`Save ${
                      productData.discounts.type === 'percentage'
                        ? productData.discounts.percentage * 100
                        : (
                            ((productData.productPrice -
                              discountPrice(productData)) /
                              productData.productPrice) *
                            100
                          ).toFixed()
                    } %`}
                  </span>
                  <span className="font-bold text-xl text-blue-800">
                    {discountPrice(productData).toLocaleString('ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold">
                  {productData?.productPrice.toLocaleString('ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0,
                  })}
                </span>
              )}
            </div>
            <button
              className={`${
                productData && productData.stock ? 'bg-blue-700' : 'bg-gray-200'
              } text-base font-semibold text-white rounded-md p-2 bg-blue-700`}
              disabled={productData && productData.stock ? false : true}
              onClick={() => setOpenDrawerDetails(true)}
            >
              Add to cart
            </button>
          </div>
        </div>
        <DrawerForUserProductCard
          inventoryid={productData && productData.id}
          openDrawer={openDrawerDetails}
          toggleDrawer={toggleDrawer}
          price={productData && productData.product.price}
          image={
            productData &&
            IMG_URL_PRODUCT + productData.product.product_images[0].image
          }
          productName={productData && productData.product.name}
          stock={productData && productData.stock}
        />
      </div>
      <Footer />
    </UserLayout>
  );
};
export default UserProductDetail;
