const NearestSTore = ({ storeData }) => {
  if (!storeData.storeName) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex">
          <span className="font-bold text-sm">Nearest Store</span>
        </div>

        <div className="h-3 animate-pulse w-24 bg-gray-200 rounded-full"></div>
        <div className="h-3 animate-pulse w-36 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <span className="font-bold text-sm">Nearest Store</span>
        <span
          className={`font-bold text-xs py-0.5 px-1 rounded-full text-white ${
            storeData.distance ? `bg-green-500` : `bg-red-500`
          }`}
        >
          {storeData.distance
            ? `${(Number(storeData.distance) / 1000).toFixed(2)} KM`
            : `Out of Range`}
        </span>
      </div>
      <span className="font-semibold text-xs">{`${storeData.storeName}`}</span>
      <span className="font-semibold text-xs">{`${storeData.district}, ${storeData.city}, ${storeData.postalCode}`}</span>
    </div>
  );
};

export default NearestSTore;
