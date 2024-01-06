import { MdModeEditOutline, MdDelete } from "react-icons/md";

const CardManage = (props) => {
    return <>
        <div className='flex flex-col w-28 h-28 bg-slate-50 border border-black rounded'>
            <div className='h-[65%]'>
                <img className='w-full h-full object-cover rounded-t' src={props.src} />
            </div>
            <div className='grid content-center flex-grow pl-1 pr-1 relative'>
                <p className='text-xs text-center line-clamp-2 font-bold'>{props.name}</p>
                <div className='absolute right-0 bottom-0'>
                    <div className='flex gap-1 p-1 text-xs'>
                        <MdModeEditOutline onClick={props.onEdit} />
                        <MdDelete color='red' onClick={props.onDelete} />
                    </div>
                </div>
            </div>
        </div>
    </>
};

export default CardManage;