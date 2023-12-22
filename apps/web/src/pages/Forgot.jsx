import { HiChevronLeft } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const Forgot = () => {
  const navigate = useNavigate();
  return (
    <div className="container lg:w-[1024px] m-auto h-screen">
      <div className="flex w-full h-full">
        <div className="header flex flex-col w-full h-full">
          <div className="flex w-full h-full justify-center items-center">
            <div className="flex flex-col w-full md:w-[50%] p-8">
              <div
                className="back flex items-center text-blue-800 font-bold gap-2 mb-2 cursor-pointer"
                onClick={() => {
                  navigate('/login');
                }}
              >
                <HiChevronLeft />
                <span>Back to Login Page</span>
              </div>
              <div className="title mb-2">
                <span className="text-3xl font-bold">Forgot Password</span>
              </div>
              <div className="mb-1">
                <label
                  for="email-input"
                  className="block font-semibold text-gray-900 text-sm mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email-input"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <span className=" invisible text-xs text-red-500">tes</span>
              </div>
              <button
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 mb-1"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
