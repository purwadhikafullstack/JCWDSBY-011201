import { Spinner } from "flowbite-react";

const LoadingSpinner = ({isLoading,  size}) => {
    return <>
        <div className={`z-30 w-full h-full justify-center content-center grid bg-gray-900 bg-opacity-50 ${isLoading ? 'fixed' : 'hidden'}`}>
            <Spinner className={`w-${size} h-${size}`} />
        </div>
    </>
};

export default LoadingSpinner;