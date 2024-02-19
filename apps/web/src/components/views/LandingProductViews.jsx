import { useNavigate } from 'react-router-dom';
import { discountPrice, promo } from '../../helpers/discount';
import UserProductCard from '../UserProductCard';

const LandingProductViews = ({ productData }) => {
  const navigate = useNavigate();
  if (productData) {
    if (productData.length > 0) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row w-full place-items-center gap-4 lg:gap-6">
          {productData.map((value, index) => (
            <UserProductCard
              key={index}
              image={`${import.meta.env.VITE_IMG_URL}/product/${
                value.product.product_images[0].image
              }`}
              category={value.product.category.name}
              inventoryid={value.id}
              productName={value.product.name}
              productUnit={value.product.weight + value.product.unit}
              price={value.product.price}
              isPromo={promo(value)}
              discountPrice={discountPrice(value)}
              stock={value.stock}
              onClickProduct={() => {
                navigate(`/product/${value.product.name}`);
              }}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col w-full h-60 md:h-64 lg:h-80 relative justify-center items-center">
          <span className=" font-bold text-3xl lg:text-4xl text-gray-300">
            No Product Found
          </span>
        </div>
      );
    }
  } else {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row w-full place-items-center gap-4 lg:gap-6">
        <div className="flex flex-col w-full h-60 md:h-64 lg:h-80 border-2 rounded-lg relative justify-center items-center cursor-pointer overflow-hidden">
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
        <div className="flex flex-col w-full h-60 md:h-64 lg:h-80 border-2 rounded-lg relative justify-center items-center cursor-pointer overflow-hidden">
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
    );
  }
};

export default LandingProductViews;
