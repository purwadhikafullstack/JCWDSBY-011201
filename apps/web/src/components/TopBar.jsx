import { IoIosArrowBack } from "react-icons/io";

const TopBar = ({title, prevPage}) => {
    return <>
        <div className='border-b shadow-md h-14 flex relative'>
            <div className='content-center justify-center grid text-3xl w-10 h-full absolute'>
                <IoIosArrowBack onClick={prevPage}/>
            </div>
            <div className='flex-grow grid content-center justify-center'>
                <p className='font-bold text-2xl font-roboto text-indigo-800'>{title}</p>
            </div>
        </div>
    </>
}

export default TopBar;