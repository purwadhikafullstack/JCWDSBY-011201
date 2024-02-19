import { HiMagnifyingGlass } from "react-icons/hi2";

const SearchBar = ({
    defaultValue,
    placeholder,
    onChange,
}) => {
    return <>
        <div className='flex rounded-xl border-2 border-gray-500 focus-within:border-gray-700 p-1 overflow-hidden items-center gap-1'>
            <span className='w-6 h-6'>
                <HiMagnifyingGlass size={'100%'} />
            </span>
            <input
                type='search'
                defaultValue={defaultValue}
                placeholder={placeholder}
                onChange={onChange}
                className=' outline-none bg-transparent'
            />
        </div>
    </>
};

export default SearchBar;