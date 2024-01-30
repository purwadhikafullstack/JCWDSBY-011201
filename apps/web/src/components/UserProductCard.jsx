import { DrawerForUserProductCard } from './DrawerForUserProductCard';
import { useState } from 'react';
import { HiHeart, HiOutlineHeart, HiOutlinePlus } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

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
}) => {
  const cartItems = useSelector((state) => state.cartReducer.items);
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const isItemExistInCart = cartItems.some(
    (item) => item.inventoryId === inventoryid,
  );
  const toggleDrawer = () => setOpenDrawer((prevState) => !prevState);
  return (
    <div className="flex flex-col w-full h-60 md:h-64 lg:h-72 border-2 rounded-lg relative cursor-pointer overflow-hidden">
      {discountPrice && (
        <span className="text-xs font-semibold absolute top-5 -left-5 py-1 pl-6 pr-2 rounded-sm bg-blue-800 text-white shadow-lg">
          {(((price - discountPrice) / price) * 100).toFixed() + '%'}
        </span>
      )}
      {wishlist ? (
        <HiHeart
          className="w-6 h-6 absolute top-5 right-2 text-red-600 cursor-pointer"
          onClick={onRemoveWishList}
        />
      ) : (
        <HiOutlineHeart
          className="w-6 h-6 absolute top-5 right-2 text-gray-600 cursor-pointer"
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
        <div className="flex flex-col h-[50%] w-full justify-between lg:px-4 py-1 lg:py-2 px-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs lg:text-sm text-gray-500">{category}</span>
            <span className="text-sm lg:text-lg font-bold line-clamp-2">
              {productName}
            </span>
          </div>
          {discountPrice ? (
            <div className="flex flex-col">
              <span className=" line-through text-base text-red-500">
                {price.toLocaleString('ID', {
                  style: 'currency',
                  currency: 'idr',
                  maximumFractionDigits: 0,
                })}
              </span>
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
          } absolute flex justify-center items-center w-10 h-10 rounded-full bottom-2 right-2`}
          type="button"
          disabled={stock ? false : true}
          onClick={toggleDrawer}
        >
          <HiOutlinePlus className="text-white w-6 h-6" />
        </button>
      ) : (
        <button
          className={`${
            stock
              ? 'bg-blue-700 hover:scale-[1.2] transition-all duration-300'
              : 'bg-gray-200'
          } absolute flex justify-center items-center w-10 h-10 rounded-full bottom-2 right-2`}
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
