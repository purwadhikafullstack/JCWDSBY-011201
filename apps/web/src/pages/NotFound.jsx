import { useLocation, useNavigate } from 'react-router-dom';
import Container from '../components/Container';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex flex-col gap-2 items-center">
          <h1 className=" text-8xl text-gray-800 font-extrabold">404</h1>
          <span className=" font-semibold text-lg">Page Not Found</span>
          <span
            className=" text-blue-800 cursor-pointer font-semibold hover:underline underline-offset-2"
            onClick={() => {
              navigate(-1);
            }}
          >
            {'<-'} Go Back
          </span>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
