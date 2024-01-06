import { FaPlus } from "react-icons/fa6";
import { FileInput } from "flowbite-react";

const BoxAddImage = (props) => {
    return <>
        <div className={`grid place-items-center w-24 h-24 border border-black border-dashed rounded ${props.isHidden && 'hidden'}`} onClick={props.onClick}>
            <div className='flex flex-col justify-center gap-1' >
                <div className='grid place-items-center' >
                    <FaPlus className='text-2xl' />
                </div>
                <div>
                    <p className='text-xs text-center font-bold'>Add Image</p>
                </div>
            </div>
            <FileInput
                className='hidden'
                accept='image/jpeg, image/jpg, image/png, image/gif'
                ref={props.refImage}
                onChange={props.onChangeImage}
                multiple={false}
            />
            {props.children}
        </div>
    </>
};

export default BoxAddImage;