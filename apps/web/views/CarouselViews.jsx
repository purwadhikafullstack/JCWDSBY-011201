import { Carousel } from 'flowbite-react';
import { useEffect, useState } from 'react';

const CarouselViews = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="h-56 w-full sm:h-64 xl:h-80 2xl:h-96">
        <img
          className="h-full w-full object-stretch animate-pulse"
          src="defaultImage.jpg"
          alt="..."
        />
      </div>
    );
  }

  return (
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
  );
};
export default CarouselViews;
