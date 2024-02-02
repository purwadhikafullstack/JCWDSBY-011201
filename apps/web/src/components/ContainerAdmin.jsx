const ContainerAdmin = (props) => {
  return (
    <div className='flex flex-row bg-blue-100 min-w-[360px] h-max min-h-screen'>
      {props.children}
    </div>
  );
};

export default ContainerAdmin;
