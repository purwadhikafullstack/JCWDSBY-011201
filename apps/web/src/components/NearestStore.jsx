import { Badge } from 'flowbite-react';

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
        <Badge
          color={`${storeData.distance ? `blue` : `failure`}`}
          className="font-bold"
        >
          {storeData.distance
            ? `${(Number(storeData.distance) / 1000).toFixed(2)} KM`
            : `Out of Range`}
        </Badge>
      </div>
      <span className="font-semibold text-xs">{`${storeData.storeName}`}</span>
      <span className="font-semibold text-xs">{`${storeData.district}, ${storeData.city}, ${storeData.postalCode}`}</span>
    </div>
  );
};

export default NearestSTore;
