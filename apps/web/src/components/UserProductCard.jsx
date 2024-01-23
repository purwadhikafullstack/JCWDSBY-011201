import { DrawerForUserProductCard } from './DrawerForUserProductCard';
import { useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const UserProductCard = ({
  image,
  productName,
  productUnit,
  price,
  discountPrice,
  stock,
  onClickProduct,
  onAddCart,
  inventoryid,
}) => {
  const cartItems = useSelector((state) => state.cartReducer.items);
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const isItemExistInCart = cartItems.some(
    (item) => item.inventoryId === inventoryid,
  );
  const toggleDrawer = () => setOpenDrawer((prevState) => !prevState);
  return (
    <div className="flex flex-col w-full h-60 md:h-64 lg:h-72 border-2 rounded-md relative cursor-pointer">
      <div className="flex flex-col w-full h-full" onClick={onClickProduct}>
        <div className="flex w-full h-[60%]">
          <img
            className="w-full h-full object-cover"
            src={image}
            alt={productName}
          />
        </div>
        <div className="flex flex-col h-[40%] justify-evenly w-full py-0.5 px-2 md:px-4">
          <span className="text-xs font-thin capitalize">
            {stock ? `ready  ${stock}` : 'Out of stock'}
          </span>
          <span className="text-sm md:text-base font-bold line-clamp-1">
            {productName} {productUnit}
          </span>
          {/* <span className="text-xs font-light">{productUnit}</span> */}
          {discountPrice ? (
            <div className="flex flex-col">
              <div className="flex">
                <span className="text-base font-semibold text-blue-800">
                  {discountPrice.toLocaleString('ID', {
                    style: 'currency',
                    currency: 'idr',
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs p-0.5 rounded-full bg-blue-800 text-white">
                  {(((price - discountPrice) / price) * 100).toFixed() + '%'}
                </span>
                <span className=" line-through text-xs text-red-500">
                  {price.toLocaleString('ID', {
                    style: 'currency',
                    currency: 'idr',
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-sm font-semibold">
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
          } absolute flex justify-center items-center w-8 h-8 rounded-full bottom-2 right-2`}
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
          } absolute flex justify-center items-center w-8 h-8 rounded-full bottom-2 right-2`}
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
