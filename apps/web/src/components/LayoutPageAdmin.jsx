const LayoutPageAdmin = (props) => {
    return <>
        <div className='w-full p-5'>
            <div className='mb-2'>
                <p className='font-extrabold text-xl'>{props.title}</p>
            </div>
            {props.children}
        </div>
    </>
}

export default LayoutPageAdmin;