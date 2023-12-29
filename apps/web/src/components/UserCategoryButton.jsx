const UserCategoryButton = ({ children, image, categoryName }) => {
  return (
    <div className="category flex flex-col w-20 h-24">
      <img
        className="aspect-square object-cover"
        src={image || '/defaultImage'}
        alt={categoryName}
        srcset=""
      />
      <span>{categoryName}</span>
    </div>
  );
};
export default UserCategoryButton;
