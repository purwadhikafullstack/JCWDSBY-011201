import { Carousel, TextInput } from 'flowbite-react';
import UserLayout from '../components/UserLayout';
import UserProductCard from '../components/UserProductCard';
import Footer from '../components/Footer';
import { HiOutlineShare } from 'react-icons/hi2';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import customToast from '../utils/toast';

const UserProductDetail = () => {
  const location = useLocation();
  const params = useParams();
  const [openModal, setOpenModal] = useState(false);
  const productData = {
    productName: 'Oatside Chocolate 250ML',
    productImage: [
      {
        image:
          'https://sesa.id/cdn/shop/files/Oatside-Oat-Milk-Chocolate-200ml-2_1_460x@2x.jpg?v=1689226576',
      },
      {
        image:
          'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/12/23/1008634c-7e02-43b6-a7d3-4fc5bfb1389b.jpg',
      },
      {
        image:
          'https://healthycornersby.com/wp-content/uploads/2022/11/Oatside-Chocolate.jpg',
      },
    ],
    productPrice: 9000,
    discountPrice: 7400,
    productUnits: '250ML/Pcs',
    categoryName: 'Milk',
    stock: 500,
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae dolore consequuntur esse inventore, repellendus ducimus illum nulla. Recusandae soluta voluptatem consectetur commodi incidunt in repellendus vel, perferendis ea nemo facere!     Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum ullam dolorem nulla alias dolorum ut incidunt enim eum laudantium, ab repellendus magnam optio earum cumque, aliquam, reiciendis voluptate natus necessitatibus.',
  };
  const related = [1, 2, 3, 4, 5, 6, 7];
  return (
    <UserLayout>
      <div className="flex flex-col gap-2 relative">
        <div className="h-96 md:h-[28rem] bg-blue-50">
          <Carousel>
            {productData.productImage.map((value) => (
              <img
                className="w-full h-full md:object-contain"
                src={value.image}
                alt="..."
              />
            ))}
          </Carousel>
        </div>
        <div className="flex p-2 flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-bold line-clamp-2">
                {productData.productName}
              </span>
              <div className="flex">
                {productData.discountPrice ? (
                  <div className="flex gap-2 items-baseline">
                    <span className="font-bold text-xl md:text-2xl text-blue-800">
                      {productData.discountPrice.toLocaleString('ID', {
                        style: 'currency',
                        currency: 'IDR',
                      })}
                    </span>
                    <span className="text-base text-red-500 line-through">
                      {productData.productPrice.toLocaleString('ID', {
                        style: 'currency',
                        currency: 'IDR',
                      })}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold">
                    {productData.productPrice.toLocaleString('ID', {
                      style: 'currency',
                      currency: 'IDR',
                    })}
                  </span>
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
            <p className="text-base font-light">{productData.description}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold">Product units</span>
            <p className="text-base font-light">{productData.productUnits}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold">Product category</span>
            <p className="text-base font-light">{productData.categoryName}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold">Product stock</span>
            <p className="text-base font-light">{productData.stock}</p>
          </div>
        </div>
        <div className="flex flex-col w-full p-2 gap-2">
          <span className="text-lg font-bold">Related products</span>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row w-full place-items-center gap-4">
            {related.map((value) => (
              <UserProductCard
                image={
                  'https://pppcoffee.com/cdn/shop/products/Chocolate_b22e9ffc-1fd7-41f9-8b88-6bac76eaf35d_1200x1200.jpg?v=1646977345'
                }
                productName={'Oatside Chocolate Barista Brew 250ML'}
                productUnit={'250ML/Pcs'}
                price={9000}
                discountPrice={7400}
                stock={49}
                onClickProduct={() =>
                  navigate('/product/sjddahGkasJSNx-672nSjdskak')
                }
              />
            ))}
          </div>
        </div>
        <div className="sticky w-full bottom-0 max-sm:bottom-[4.5rem]">
          <div className="flex w-full justify-between items-center px-2 py-3 bg-blue-50">
            <div className="flex">
              {productData.discountPrice ? (
                <div className="flex gap-2 items-center">
                  <span className="text-white text-base font-semibold bg-blue-800 p-1 rounded-md">
                    {'Save ' +
                      (
                        ((productData.productPrice -
                          productData.discountPrice) /
                          productData.productPrice) *
                        100
                      ).toFixed() +
                      '%'}
                  </span>
                  <span className="font-bold text-xl text-blue-800">
                    {productData.discountPrice.toLocaleString('ID', {
                      style: 'currency',
                      currency: 'IDR',
                    })}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold">
                  {productData.productPrice.toLocaleString('ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })}
                </span>
              )}
            </div>
            <button className="text-base font-semibold text-white rounded-md p-2 bg-blue-700">
              Add to cart
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </UserLayout>
  );
};

export default UserProductDetail;
