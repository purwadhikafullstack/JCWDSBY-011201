import { Spinner } from "flowbite-react";

const LoadingSpinner = (props) => {
    return <>
        <div className={`top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${props.isLoading ? 'fixed' : 'hidden'}`}>
            <Spinner className={`w-${props.size} h-${props.size}`} />
        </div>
    </>
};

export default LoadingSpinner;