import { HiArrowRight } from 'react-icons/hi2';

const ButtonSeeAll = ({ onClick }) => {
  return (
    <div
      className="flex h-fit w-fit items-center gap-1 rounded-full pt-1 pr-1 pb-1 pl-5 bg-blue-700 group cursor-pointer hover:shadow-md"
      onClick={onClick}
    >
      <span className="font-bold text-white text-xs text-right">See All</span>
      <span className="flex bg-white rounded-full p-3 items-center">
        <HiArrowRight className=" w-4 h-4" />
      </span>
    </div>
  );
};

export default ButtonSeeAll;
