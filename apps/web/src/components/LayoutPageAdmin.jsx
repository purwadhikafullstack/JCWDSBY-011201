const LayoutPageAdmin = (props) => {
    return <>
        <div className='w-full px-5 lg:px-10 pt-16 lg:pt-10'>
            <div className='mb-2'>
                <p className='font-extrabold font-roboto text-indigo-600 text-xl lg:text-4xl'>{props.title}</p>
            </div>
            {props.children}
        </div>
    </>
}

export default LayoutPageAdmin;