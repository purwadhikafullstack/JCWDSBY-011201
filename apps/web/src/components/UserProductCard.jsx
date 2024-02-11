import { DrawerForUserProductCard } from './DrawerForUserProductCard';
import { useState } from 'react';
import { HiHeart, HiOutlinePlus } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge } from 'flowbite-react';

const UserProductCard = ({
  image,
  productName,
  productUnit,
  price,
  category,
  discountPrice,
  stock,
  onClickProduct,
  onAddCart,
  inventoryid,
  onAddWishList,
  onRemoveWishList,
  wishlist,
  isPromo,
}) => {
  const cartItems = useSelector((state) => state.cartReducer.items);
  const currUser = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const isItemExistInCart = cartItems.some(
    (item) => item.inventoryId === inventoryid,
  );
  const toggleDrawer = () => setOpenDrawer((prevState) => !prevState);
  return (
    <div className="flex flex-col w-full h-60 md:h-64 lg:h-80 border-2 rounded-lg relative cursor-pointer overflow-hidden ">
      {discountPrice && (
        <div className="mt-3 absolute">
          <div className="flex">
            {isPromo && (
              <Badge color={'success'} className="rounded-e-md rounded-s-none">
                Buy 1 Get 1
              </Badge>
            )}
          </div>
          <span className="text-xs mt-1 font-semibold absolute top-5 -left-5 py-1 pl-6 pr-2 rounded-e-md bg-blue-800 text-white shadow-xl">
            {(((price - discountPrice) / price) * 100).toFixed() + '%'}
          </span>
        </div>
      )}
      {!discountPrice && isPromo && (
        <div className="mt-3 absolute">
          <div className="flex">
            <Badge color={'success'} className="rounded-e-md rounded-s-none">
              Buy 1 Get 1
            </Badge>
          </div>
        </div>
      )}
      {wishlist ? (
        <HiHeart
          className="w-6 h-6 absolute top-5 right-2 text-red-600 cursor-pointer"
          onClick={onRemoveWishList}
        />
      ) : (
        <HiHeart
          className="w-6 h-6 absolute top-5 right-2 text-gray-400 opacity-80 cursor-pointer"
          onClick={onAddWishList}
        />
      )}
      <div className="flex flex-col w-full h-full" onClick={onClickProduct}>
        <div className="flex w-full h-[50%]">
          <img
            className="w-full h-full object-cover"
            src={image}
            alt={productName}
          />
        </div>
        <div className="flex flex-col h-[50%] w-full justify-between lg:px-4 py-1 lg:py-3 px-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs lg:text-sm text-gray-500">{category}</span>
            <span className="text-sm lg:text-lg font-bold line-clamp-2">
              {productName}
            </span>
          </div>
          {discountPrice ? (
            <div className="flex flex-col">
              <div className="flex gap-2">
                <span className=" line-through text-base text-red-500">
                  {price.toLocaleString('ID', {
                    style: 'currency',
                    currency: 'idr',
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="flex">
                <span className="text-lg font-bold text-blue-800">
                  {discountPrice.toLocaleString('ID', {
                    style: 'currency',
                    currency: 'idr',
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-lg font-bold text-blue-800">
              {price.toLocaleString('ID', {
                style: 'currency',
                currency: 'idr',
                maximumFractionDigits: 0,
              })}
            </span>
          )}
        </div>
      </div>
      {!isItemExistInCart ? (
        <button
          className={`${
            stock
              ? 'bg-blue-700 hover:scale-[1.2] transition-all duration-300'
              : 'bg-gray-200'
          } absolute flex justify-center items-center w-10 h-10 rounded-full bottom-2 lg:bottom-4 right-2`}
          type="button"
          disabled={stock ? false : true}
          onClick={() => {
            if (currUser.email === '') {
              navigate('/login', {
                state: {
                  previousPath: location.pathname,
                },
              });
            } else {
              toggleDrawer();
            }
          }}
        >
          <HiOutlinePlus className="text-white w-6 h-6" />
        </button>
      ) : (
        <button
          className={`${
            stock
              ? 'bg-blue-700 hover:scale-[1.2] transition-all duration-300'
              : 'bg-gray-200'
          } absolute flex justify-center items-center w-10 h-10 rounded-full bottom-2 lg:bottom-4 right-2`}
          type="button"
          onClick={() => {
            navigate('/cart');
          }}
        >
          <BsFillCartCheckFill className="text-white w-5 h-5" />
        </button>
      )}
      <DrawerForUserProductCard
        inventoryid={inventoryid}
        openDrawer={openDrawer}
        toggleDrawer={toggleDrawer}
        price={price}
        image={image}
        productName={productName}
        stock={stock}
      />
    </div>
  );
};

export default UserProductCard;
