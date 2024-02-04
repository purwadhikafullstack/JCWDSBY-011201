const ContainerAdmin = (props) => {
  return (
    <div className='flex flex-row min-w-[360px] h-max min-h-screen'>
      {props.children}
    </div>
  );
};

export default ContainerAdmin;
