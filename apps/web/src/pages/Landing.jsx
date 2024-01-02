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
        <div className="h-56 w-full sm:h-64 xl:h-80 2xl:h-96">
          <Carousel>
            <img
              className="h-full object-stretch"
              src="https://www.astronauts.id/blog/wp-content/uploads/2023/12/Spesial-Akhir-Tahun-Belanja-di-Astro-Pakai-Kartu-Kredit-BRI-Dapat-Diskon-1.jpg"
              alt="..."
            />
            <img
              className="h-full object-stretch"
              src="https://www.astronauts.id/blog/wp-content/uploads/2023/10/Serbu-Promo-Tanggal-Kembar-di-Astro.png"
              alt="..."
            />
            <img
              className="h-full object-stretch"
              src="https://www.astronauts.id/blog/wp-content/uploads/2023/12/Super-Brand-Day-Colgate-Palmolive-Hadir-di-Astro-dengan-Berbagai-Hadiah-Menarik.jpg"
              alt="..."
            />
          </Carousel>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base">Categories</span>
        </div>
        <div className="flex w-full h-[2000px]"></div>
      </div>
    </UserLayout>
  );
};

export default Landing;
