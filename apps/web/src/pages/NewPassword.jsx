const NewPassword = () => {
  return (
    <div className="container lg:w-[1024px] m-auto h-screen">
      <div className="flex w-full h-full">
        <div className="header flex flex-col w-full h-full">
          <div className="flex w-full h-full justify-center items-center">
            <div className="flex flex-col w-full md:w-[50%] p-8">
              <div className="title mb-2">
                <span className="text-3xl font-bold">Reset Password</span>
              </div>
              <div className="mb-1">
                <label
                  for="newPassword-input"
                  className="block font-semibold text-gray-900 text-sm mb-1"
                >
                  Create New Password
                </label>
                <input
                  type="password"
                  id="newPassword-input"
                  placeholder="Input new password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <span className=" invisible text-xs text-red-500">tes</span>
              </div>
              <div className="mb-1">
                <label
                  for="confirmPassword-input"
                  className="block font-semibold text-gray-900 text-sm mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword-input"
                  placeholder="Input new password again"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <span className=" invisible text-xs text-red-500">tes</span>
              </div>
              <button
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 mb-1"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
