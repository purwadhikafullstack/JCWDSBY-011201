import Footer from '../components/Footer';
import UserCategoryButton from '../components/UserCategoryButton';
import UserLayout from '../components/UserLayout';
import { Carousel } from 'flowbite-react';
import UserProductCard from '../components/UserProductCard';
import { useNavigate, useSearchParams } from 'react-router-dom';

const UserFindCategory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const sort = [
    { sortName: 'Lowest Price', value: 'lowest' },
    { sortName: 'Highest Price', value: 'highest' },
    { sortName: 'Name A-Z', value: 'nameasc' },
    { sortName: 'Name Z-A', value: 'namedesc' },
  ];
  const category = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const product = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 6, 5, 67, 8, 9];
  return (
    <UserLayout>
      <div className="flex flex-col w-full flex-grow p-4 gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-base">Categories</span>
          <div className="flex w-full border-2 p-2 md:p-4 overflow-auto rounded-xl bg-blue-50">
            <div className="grid grid-rows-1 grid-flow-col gap-4">
              {category.map((value) => (
                <UserCategoryButton
                  key={value}
                  image={
                    'https://media.post.rvohealth.io/wp-content/uploads/2020/08/fruits-and-vegetables-thumb-1-732x549.jpg'
                  }
                  categoryName={'Vegetables'}
                  isSelected={
                    searchParams.get('category') === value.toString()
                      ? true
                      : false
                  }
                  onClick={() => {
                    setSearchParams((prev) => {
                      if (prev.get('category') === value.toString()) {
                        prev.delete('category');
                      } else {
                        prev.set('category', value);
                      }
                      return prev;
                    });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm font-semibold">Sort By</span>
          <select
            className="text-sm font-bold rounded-full border-2 p-2"
            name="sort"
            id="sort"
            onChange={(e) => {
              setSearchParams((prev) => {
                if (e.target.value) {
                  prev.set('sort', e.target.value);
                } else {
                  prev.delete('sort');
                }
                return prev;
              });
            }}
          >
            <option value="">None</option>
            {sort.map((value) => (
              <option
                key={value}
                value={value.value}
                selected={searchParams.get('sort') === value.value && true}
              >
                {value.sortName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold text-base">
            Products {searchParams.get('q') && `for "${searchParams.get('q')}"`}
          </span>
          <div className="flex w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row w-full place-items-center gap-4">
              {product.map((value) => (
                <UserProductCard
                  image={
                    'https://pppcoffee.com/cdn/shop/products/Chocolate_b22e9ffc-1fd7-41f9-8b88-6bac76eaf35d_1200x1200.jpg?v=1646977345'
                  }
                  productName={'Oatside Chocolate Barista Brew 250ML'}
                  productUnit={'250ML/Pcs'}
                  price={9000}
                  discountPrice={7400}
                  stock={49}
                  onClickProduct={() =>
                    navigate('/product/sjddahGkasJSNx-672nSjdskak')
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </UserLayout>
  );
};

export default UserFindCategory;
