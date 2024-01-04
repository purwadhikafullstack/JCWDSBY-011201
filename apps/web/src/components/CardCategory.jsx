import { MdModeEditOutline, MdDelete } from "react-icons/md";

const CardCategory = (props) => {
    return <>
        <div className='flex flex-col w-32 h-32 bg-slate-50 border border-black rounded'>
            <div className='h-[65%]'>
                <img className='w-full h-full object-cover rounded-t' src={props.src} />
            </div>
            <div className='grid content-center flex-grow pl-1 pr-1 relative'>
                <p className='text-xs text-center line-clamp-2 font-bold'>{props.name}</p>
                <div className='absolute right-0 bottom-0'>
                    <div className='flex gap-1 p-1 text-xs'>
                        <MdModeEditOutline className='cursor-pointer' onClick={props.onEdit} />
                        <MdDelete color='red' className='cursor-pointer' onClick={props.onDelete} />
                    </div>
                </div>
            </div>
        </div>
    </>
};

export default CardCategory;