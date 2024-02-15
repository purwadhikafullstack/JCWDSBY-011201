const WidgetLayoutBox = ({
  title,
  children
}) => {
  return <div className="border-2 h-80 lg:h-96 rounded-md shadow-lg">
    <div className="h-[15%] flex justify-center items-center">
      <p className='font-bold text-2xl lg:text-3xl'>{title}</p>
    </div>
    <div className='h-[85%] relative'>
      {children}
    </div>
  </div>
};

export default WidgetLayoutBox;