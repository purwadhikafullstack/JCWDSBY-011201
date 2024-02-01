import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/TopBar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useEffect, useState } from "react";
import ModalConfirm from "../../components/modal/ModalConfirm";
import StepperDiscount from "../../components/StepperDiscount";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiscountData, updateDiscount } from "../../redux/slice/discountSlice";

const ManageDiscountEdit = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState();
    const [isOpen, setIsOpen] = useState();
    const discData = useSelector((state) => state.discountReducer);

    useEffect(() => {
        dispatch(fetchDiscountData(params.UUID))
    }, [])

    return <div className='flex flex-col bg-blue-100 min-w-[360px] h-max min-h-screen'>
        <TopBar title='Edit Discount' prevPage={() => navigate('/manage/discount')} />
        <LoadingSpinner size={16} isLoading={isLoading} />
        <div className="mt-5 mx-5">
            <StepperDiscount
                onLoading={setIsLoading}
                onSave={() => setIsOpen(true)}
            />
        </div>
        <ModalConfirm
        show={isOpen}
        header={'Update Discount'}
        message={'Are you sure you want to update discount?'}
        onClose={() => setIsOpen(false)}
        onConfirm={() => { dispatch(updateDiscount(discData)); navigate('/manage/discount') }}
        />
    </div>
};

export default ManageDiscountEdit;