import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import groceryWomanImage from '../../assets/grocery-woman.png';
import deliveryManImage from '../../assets/delivery-man.png';
import groceryBagImage from '../../assets/grocery-bag.png';

const MiniHeroViews = () => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full lg:py-8">
      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-3">
        <div className="flex relative w-full h-52 lg:h-64 border py-4 px-6 lg:px-8 items-center bg-blue-600 rounded-lg gap-1">
          <div className="flex flex-col w-[60%] justify-center gap-2 lg:gap-3">
            <span className="text-white font-semibold text-xs lg:text-base">
              Up to 20% Off
            </span>
            <span className="text-white font-bold text-2xl lg:text-2xl">
              Quality and Affordable
            </span>
            <Button
              className="w-fit"
              size={'sm'}
              pill
              color="light"
              onClick={() => navigate('/category')}
            >
              See All
            </Button>
          </div>
          <img
            className="h-full w-32 md:w-24 lg:w-40 right-2 absolute object-contain drop-shadow-2xl"
            src={groceryWomanImage}
            alt=""
          />
        </div>
        <div className="flex relative w-full h-52 lg:h-64 border py-4 px-6 lg:px-8 items-center bg-blue-400 rounded-lg gap-1">
          <div className="flex flex-col w-[60%] justify-center gap-2 lg:gap-3">
            <span className="text-white font-semibold text-xs lg:text-base">
              Shop Anywhere
            </span>
            <span className="text-white font-bold text-2xl lg:text-2xl">
              Groceries in Your hand
            </span>
            <Button
              className="w-fit"
              size={'sm'}
              pill
              color="light"
              onClick={() => navigate('/category')}
            >
              See All
            </Button>
          </div>
          <img
            className="h-full w-32 md:w-24 lg:w-40 right-2 absolute object-contain drop-shadow-2xl"
            src={deliveryManImage}
            alt=""
          />
        </div>
        <div className="flex relative w-full h-52 lg:h-64 border py-4 px-6 lg:px-8 items-center bg-blue-700 rounded-lg gap-1">
          <div className="flex flex-col w-[60%] justify-center gap-2 lg:gap-3">
            <span className="text-white font-semibold text-xs lg:text-base">
              Original Products
            </span>
            <span className="text-white font-bold text-2xl lg:text-2xl">
              No Need to Worry
            </span>
            <Button
              className="w-fit"
              size={'sm'}
              pill
              color="light"
              onClick={() => navigate('/category')}
            >
              See All
            </Button>
          </div>
          <img
            className="h-full w-32 md:w-24 lg:w-40 right-2 absolute object-contain drop-shadow-2xl"
            src={groceryBagImage}
            alt="Grocery Bag"
          />
        </div>
      </div>
    </div>
  );
};
export default MiniHeroViews;
