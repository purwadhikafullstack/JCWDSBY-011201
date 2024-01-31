const HeroFooter = () => {
  return (
    <div className="flex w-full justify-center lg:px-24 py-2 lg:py-3">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="flex gap-4 items-center p-2 group border-b-4 hover:border-blue-700 cursor-pointer transition-all duration-300">
          <img
            className="w-8 h-8 md:w-16 md:h-16 object-cover"
            src="/original.png"
            alt="original"
          />
          <span className="font-semibold text-sm md:text-lg text-gray-500 group-hover:text-gray-800">
            100% Original Product
          </span>
        </div>
        <div className="flex gap-4 items-center p-2 group border-b-4 hover:border-blue-700 cursor-pointer transition-all duration-300">
          <img
            className="w-8 h-8 md:w-16 md:h-16 object-cover"
            src="/delivery-box.png"
            alt="original"
          />
          <span className="font-semibold text-sm md:text-lg text-gray-500  group-hover:text-gray-800">
            Delivery to Your Home
          </span>
        </div>
        <div className="flex gap-4 items-center p-2 group border-b-4 hover:border-blue-700 cursor-pointer transition-all duration-300">
          <img
            className="w-8 h-8 md:w-16 md:h-16 object-cover"
            src="/super-sale.png"
            alt="original"
          />
          <span className="font-semibold text-sm md:text-lg text-gray-500  group-hover:text-gray-800">
            Special Sales Every Week
          </span>
        </div>
        <div className="flex gap-4 items-center p-2 group border-b-4 hover:border-blue-700 cursor-pointer transition-all duration-300">
          <img
            className="w-8 h-8 md:w-16 md:h-16 object-cover"
            src="/discount.png"
            alt="original"
          />
          <span className="font-semibold text-sm md:text-lg text-gray-500  group-hover:text-gray-800">
            Discount Up to 20% All Items
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroFooter;
