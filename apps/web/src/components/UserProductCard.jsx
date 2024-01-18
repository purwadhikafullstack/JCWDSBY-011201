import { DrawerForUserProductCard } from './DrawerForUserProductCard';
import { Button } from 'flowbite-react';
import { useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi2';

const UserProductCard = ({
  image,
  productName,
  productUnit,
  price,
  discountPrice,
  stock,
  onClickProduct,
  onAddCart,
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);

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
        <div className="flex flex-col h-[40%] w-full justify-around py-0.5 px-1">
          <span className="text-sm font-bold line-clamp-1">{productName}</span>
          <span className="text-xs font-light">{productUnit}</span>
          {discountPrice ? (
            <div className="flex flex-col">
              <div className="flex">
                <span className="text-sm font-semibold text-blue-800">
                  {discountPrice.toLocaleString('ID', {
                    style: 'currency',
                    currency: 'idr',
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
                  })}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-sm font-semibold">
              {price.toLocaleString('ID', {
                style: 'currency',
                currency: 'idr',
              })}
            </span>
          )}
          <span className="text-xs font-thin">
            {stock ? `stock: ${stock}` : 'Out of stock'}
          </span>
        </div>
      </div>
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
      <DrawerForUserProductCard
        openDrawer={openDrawer}
        toggleDrawer={toggleDrawer}
        price={price}
        image={image}
        productName={productName}
      />
    </div>
  );
};

export default UserProductCard;
