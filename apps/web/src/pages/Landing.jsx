import Footer from '../components/Footer';
import UserCategoryButton from '../components/UserCategoryButton';
import UserLayout from '../components/UserLayout';
import { Carousel } from 'flowbite-react';
import UserProductCard from '../components/UserProductCard';
import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    getProduct();
    getCategory();
  }, [])

  const getProduct = async () => {
    const res = await API_CALL.get('product/inventory');
    // console.log('RES >>>', res.data);
    if (res) {
      setProduct(res.data);
    }
  };

  const getCategory = async () => {
    const res = await API_CALL.get('category');
    // console.log('RES >>>', res.data);
    if (res) {
      setCategory(res.data);
    }
  };
  // console.log('DATA >>>', product.product_image);
  return (
    <UserLayout>
      <div className="flex flex-col w-full flex-grow p-4 gap-4">
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm">Your Location</span>
            <span className="font-semibold text-sm">Baron, Nganjuk, 64394</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm">Nearest Store</span>
            <span className="font-semibold text-sm">
              Gubeng, Surabaya, 64394
            </span>
          </div>
        </div>

        <div className="h-56 w-full sm:h-64 xl:h-80 2xl:h-96">
          <Carousel>
            <img
              className="h-full object-cover"
              src="https://www.astronauts.id/blog/wp-content/uploads/2023/12/Spesial-Akhir-Tahun-Belanja-di-Astro-Pakai-Kartu-Kredit-BRI-Dapat-Diskon-1.jpg"
              alt="..."
            />
            <img
              className="h-full object-cover"
              src="https://www.astronauts.id/blog/wp-content/uploads/2023/10/Serbu-Promo-Tanggal-Kembar-di-Astro.png"
              alt="..."
            />
            <img
              className="h-full object-cover"
              src="https://www.astronauts.id/blog/wp-content/uploads/2023/12/Super-Brand-Day-Colgate-Palmolive-Hadir-di-Astro-dengan-Berbagai-Hadiah-Menarik.jpg"
              alt="..."
            />
          </Carousel>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold text-base">Categories</span>
          <div className="flex w-full border-2 p-2 md:p-4 overflow-auto rounded-xl bg-blue-50">
            <div className="grid grid-rows-2 grid-flow-col gap-4">
              {category.map((value, index) => (
                <UserCategoryButton
                key={index}
                  image={`${import.meta.env.VITE_IMG_URL}/category/${value.image}`}
                  categoryName={value.name}
                  isSelected={false}
                />
              ))}
              {/* {category.map((value) => (
                <UserCategoryButton
                  image={
                    'https://media.post.rvohealth.io/wp-content/uploads/2020/08/fruits-and-vegetables-thumb-1-732x549.jpg'
                  }
                  categoryName={'Vegetables'}
                  isSelected={false}
                />
              ))} */}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold text-base">Special Promos</span>
          <div className="flex w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row w-full place-items-center gap-4">
            {product.map((value, index) => (
                <UserProductCard
                  key={index}
                  image={`${import.meta.env.VITE_IMG_URL}/product/${value.product.product_images[0].image}`}
                  productName={value.product.name}
                  productUnit={'250ML/Pcs'}
                  price={value.product.price}
                  discountPrice={7400}
                  stock={value.stock}
                  onClickProduct={() => {navigate(`/product/${value.product.name}`)}}
                />
              ))} 
              {/* {product.map((value) => (
                <UserProductCard
                  image={
                    'https://pppcoffee.com/cdn/shop/products/Chocolate_b22e9ffc-1fd7-41f9-8b88-6bac76eaf35d_1200x1200.jpg?v=1646977345'
                  }
                  productName={'Oatside Chocolate Barista Brew 250ML'}
                  productUnit={'250ML/Pcs'}
                  price={9000}
                  discountPrice={7400}
                  stock={49}
                />
              ))} */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </UserLayout>
  );
};

export default Landing;
