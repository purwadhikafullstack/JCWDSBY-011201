import { FaPlus } from "react-icons/fa6";

const BoxAddItem = (props) => {
    return <>
        <div className='grid place-items-center w-28 h-28 border border-black rounded cursor-pointer' onClick={props.onClick}>
            <div className='flex flex-col justify-center gap-1 w-24 h-24' >
                <div className='grid place-items-center' >
                    <FaPlus className='text-3xl' />
                </div>
                <div>
                    <p className='text-sm text-center font-bold'>{props.title}</p>
                </div>
            </div>
        </div>
    </>
}

export default BoxAddItem;