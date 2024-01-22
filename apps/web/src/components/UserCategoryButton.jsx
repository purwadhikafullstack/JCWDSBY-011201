const UserCategoryButton = ({ image, categoryName, onClick, isSelected }) => {
  return (
    <div
      className={`flex flex-col w-20 h-24 md:w-32 md:h-36 ${
        isSelected ? 'border-4 border-blue-500' : 'border-2'
      } rounded-md overflow-hidden bg-slate-100 cursor-pointer`}
      onClick={onClick}
    >
      <div className="h-[60%] w-full">
        <img
          className="w-full h-full object-cover "
          src={image}
          alt={categoryName}
        />
      </div>
      <div className="flex h-[40%] p-0.5 items-center justify-center ">
        <span className="text-xs font-semibold line-clamp-2 text-center p-0.5">
          {categoryName}
        </span>
      </div>
    </div>
  );
};
export default UserCategoryButton;
