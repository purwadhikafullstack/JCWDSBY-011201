import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const FindCategoryViews = ({ categoryData }) => {
  const navigate = useNavigate();

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  const colors = {
    1: 'bg-blue-50',
    2: 'bg-slate-50',
    3: 'bg-green-50',
  };

  if (!categoryData) {
    return (
      <Carousel
        responsive={responsive}
        arrows={true}
        infinite={true}
        swipeable={true}
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <div key={value} className="flex w-full justify-center items-center">
            <div className="flex items-center justify-center  w-44 h-56 lg:w-48 lg:h-64 bg-gray-300 rounded-lg animate-pulse">
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
        ))}
      </Carousel>
    );
  }

  return (
    <Carousel
      responsive={responsive}
      arrows={true}
      infinite={true}
      swipeable={true}
    >
      {categoryData.map((value) => (
        <div
          key={value.name}
          className="flex w-full justify-center items-center"
        >
          <div
            className={`flex flex-col gap-1 lg:gap-4 cursor-pointer justify-center w-28 h-32 lg:w-44 lg:h-56  items-center px-3 md:px-4 py-6 md:py-10 lg:px-6 lg:py-14 border rounded-lg ${
              colors[Math.ceil(Math.random() * 3)]
            }`}
            onClick={() => {
              navigate(`/category?category=${encodeURI(value.name)}`);
            }}
          >
            <img
              className="aspect-square rounded-lg object-cover border w-20 lg:w-max"
              src={`${import.meta.env.VITE_IMG_URL}/category/${value.image}`}
              alt={value.name}
            />
            <span className="font-semibold text-base md:text-xl text-center">
              {value.name}
            </span>
          </div>
        </div>
      ))}
    </Carousel>
  );
};
export default FindCategoryViews;
