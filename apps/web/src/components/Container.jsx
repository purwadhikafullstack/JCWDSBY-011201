const Container = (props) => {
  return (
    <div className="m-auto h-screen overflow-auto">
      {props.children}
    </div>
  );
};

export default Container;
