import { Select } from "flowbite-react";

const SortBar = ({
    title,
    onChange,
    hidden,
    defaultValue,
    children,
}) => {
    return <>
        <div className={`flex justify-between items-center lg:gap-2 ${hidden && 'hidden'}`}>
            <span className='font-bold'>{title}</span>
            <Select onChange={onChange} defaultValue={defaultValue}>
                {children}
            </Select>
        </div>
    </>
};

export default SortBar;