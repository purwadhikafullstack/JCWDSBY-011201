import { Spinner } from 'flowbite-react';
const Loader = (props) => {
  return (
    <div
      className={`${
        props.isLoading
          ? 'flex bg-white w-screen h-screen absolute left-0 top-0 justify-center items-center z-30 transition-opacity duration-500'
          : 'hidden'
      } `}
    >
      <Spinner light aria-label="Loading..." className="w-16 h-16" />
    </div>
  );
};

export default Loader;
