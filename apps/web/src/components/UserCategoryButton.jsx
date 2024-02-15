const UserCategoryButton = ({ image, categoryName, onClick, isSelected }) => {
  return (
    <div className={`flex flex-col w-24 h-28 md:w-40 md:h-48 overflow-hidden cursor-pointer`} onClick={onClick}>
      <div className="h-[70%] w-full">
        <img
          className={`w-full h-full object-cover rounded-xl shadow-sm ${isSelected ? 'border-4 border-blue-500' : 'border-2'}`}
          src={image}
          alt={categoryName}
        />
      </div>
      <div className="flex h-[30%] p-0.5 items-center justify-center ">
        <span className="text-xs md:text-lg font-semibold line-clamp-2 text-center p-0.5">
          {categoryName}
        </span>
      </div>
    </div>
  );
};
export default UserCategoryButton;
