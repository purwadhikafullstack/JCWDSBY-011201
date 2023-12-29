import CarouselViews from '../../views/CarouselViews';
import Container from '../components/Container';
import UserBottomBar from '../components/UserBottomBar';
import UserCategoryButton from '../components/UserCategoryButton';
import UserLayout from '../components/UserLayout';
import UserTopbar from '../components/UserTopBar';
import { Carousel } from 'flowbite-react';

const Landing = () => {
  return (
    <UserLayout>
      <div className="flex flex-col w-full p-4 gap-4">
        <div className="flex flex-col w-full gap-1">
          <span className="font-bold text-sm">Delivery to</span>
          <span className="font-semibold text-sm">Baron, Nganjuk, 64394</span>
        </div>
        <CarouselViews data={[]} />
        <div className="flex flex-col">
          <span className="font-bold text-base">Categories</span>
          <div className="grid grid-cols-4">
            {Array(5, 4, 2, 3, 21, 2, 3, 1, 3, 2).map((value) => {
              return (
                <UserCategoryButton
                  image={
                    'https://media.wired.com/photos/5b493b6b0ea5ef37fa24f6f6/16:9/w_2400,h_1350,c_limit/meat-80049790.jpg'
                  }
                  categoryName={'Meat'}
                />
              );
            })}
          </div>
        </div>
        <div className="flex w-full h-[2000px]"></div>
      </div>
    </UserLayout>
  );
};

export default Landing;
