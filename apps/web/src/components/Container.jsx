const Container = (props) => {
  return (
    <div className="container lg:w-[1024px] m-auto h-screen overflow-auto">
      {props.children}
    </div>
  );
};

export default Container;
