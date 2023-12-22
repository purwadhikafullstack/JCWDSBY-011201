import { Spinner } from 'flowbite-react';
const Loader = (props) => {
  return (
    <div
      className={`${
        props.isLoading ? 'flex' : 'hidden'
      } bg-white w-screen h-screen absolute top-0 justify-center items-center z-30`}
    >
      <Spinner light aria-label="Loading..." className="w-16 h-16" />
    </div>
  );
};

export default Loader;
