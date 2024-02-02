import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useState } from "react";
import Stepper from "../../components/Stepper";
import API_CALL from "../../helpers/API";
import ModalConfirm from "../../components/modal/ModalConfirm";

const ManageDiscountAdd = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState();
    const [isError, setIsError] = useState();
    const [isOpen, setIsOpen] = useState();
    const [discountData, setDiscountData] = useState();

    const handleCreateDiscount = async (payload) => {
        setDiscountData(payload);
        setIsOpen(true);
    };

    const handleConfirmButton = async () => {
        try {
            setIsLoading(true);
            setIsOpen(false);
            await API_CALL.post('discount', discountData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            },);
            setIsLoading(false);
            navigate('/manage/discount');
        } catch (error) {
            console.error(error);
            if(error.response.status === 409) {
                setIsLoading(false);
                setIsOpen(false);
                return setIsError(true);
            }
        }
    };

    return <div className='flex flex-col bg-blue-100 min-w-[360px] h-max min-h-screen'>
        <TopBar title='Create Discount' prevPage={() => navigate('/manage/discount')} />
        <LoadingSpinner size={16} isLoading={isLoading} />
        <div className="mt-5 mx-5">
            <Stepper
                onLoading={setIsLoading}
                onCreate={(val) => handleCreateDiscount(val)}
                errorDuplicateVoucher={isError}
            />
        </div>
        <ModalConfirm
        show={isOpen}
        header={'Create Discount'}
        message={'Are you sure you want to create a new Discount?'}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirmButton}
        />
    </div>
};

export default ManageDiscountAdd;