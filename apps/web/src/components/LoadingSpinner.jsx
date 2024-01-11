import { Spinner } from "flowbite-react";

const LoadingSpinner = (props) => {
    return <>
        <div className={`z-10 w-full h-full justify-center content-center grid bg-gray-900 bg-opacity-50 ${props.isLoading ? 'fixed' : 'hidden'}`}>
            <Spinner className={`w-${props.size} h-${props.size}`} />
        </div>
    </>
};

export default LoadingSpinner;