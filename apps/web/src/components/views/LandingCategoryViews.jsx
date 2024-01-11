import { useNavigate } from 'react-router-dom';
import UserCategoryButton from '../UserCategoryButton';

const LandingCategoryViews = ({ categoryData }) => {
  const navigate = useNavigate();
  if (!categoryData) {
    return (
      <div className="flex w-full border-2 p-2 md:p-4 overflow-auto rounded-xl bg-blue-50">
        <div className="grid grid-rows-1 grid-flow-col gap-4">
          <div class="flex items-center justify-center w-20 h-24 md:w-32 md:h-36 bg-gray-300 rounded animate-pulse">
            <svg
              class="w-10 h-10 text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
          <div class="flex items-center justify-center w-20 h-24 md:w-32 md:h-36 bg-gray-300 rounded animate-pulse">
            <svg
              class="w-10 h-10 text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
          <div class="flex items-center justify-center w-20 h-24 md:w-32 md:h-36 bg-gray-300 rounded animate-pulse">
            <svg
              class="w-10 h-10 text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full border-2 p-2 md:p-4 overflow-auto rounded-xl bg-blue-50`}
    >
      <div
        className={`grid ${
          categoryData.length <= 14
            ? 'grid-rows-1 max-sm:grid-rows-2'
            : 'grid-rows-2'
        } grid-flow-col gap-4`}
      >
        {categoryData.map((value) => (
          <UserCategoryButton
            key={value.name}
            image={`${import.meta.env.VITE_IMG_URL}/category/${value.image}`}
            categoryName={value.name}
            isSelected={false}
            onClick={() => {
              navigate(`/category?category=${encodeURI(value.name)}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};
export default LandingCategoryViews;
