const VerifyEmail = () => {
  return (
    <div className="container lg:w-[1024px] m-auto h-screen">
      <div className="flex w-full h-full">
        <div className="header flex flex-col w-full h-full">
          <div className="flex w-full h-full justify-center items-center">
            <div className="flex flex-col w-full md:w-[50%] p-8">
              <div className="title mb-6">
                <span className="text-3xl font-bold">Verify Email</span>
              </div>
              <button
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 mb-1"
              >
                Verify New Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
