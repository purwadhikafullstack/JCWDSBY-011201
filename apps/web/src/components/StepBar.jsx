const StepBar = ({
    stepTitle,
    mobileTitle,
    stepColor,
    onStep,
    onClickStep,
}) => {

    return <div>
        <ol className="flex items-center justify-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm sm:text-base sm:p-4 sm:space-x-4">
            {stepTitle && stepTitle.map((val, index) => {
                return <li className={`flex items-center cursor-pointer ${onStep >= index + 1 && stepColor}`} onClick={() => onClickStep(index + 1)} key={index}>
                    <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                        {index + 1}
                    </span>
                    <span className="hidden sm:inline-flex">{val}</span> <span className="inline-flex sm:ms-2 sm:hidden">{mobileTitle[index]}</span>
                    <svg className={`w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180 ${index === stepTitle.length - 1 && 'hidden'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4" />
                    </svg>
                </li>
            })}
        </ol>
    </div>
};

export default StepBar;