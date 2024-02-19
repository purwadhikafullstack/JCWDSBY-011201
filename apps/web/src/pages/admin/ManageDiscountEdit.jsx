import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/TopBar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useEffect, useState } from "react";
import ModalConfirm from "../../components/modal/ModalConfirm";
import StepperDiscount from "../../components/StepperDiscount";
import { useDispatch, useSelector } from "react-redux";
import { clearDiscountData, fetchDiscountData, updateDiscount } from "../../redux/slice/discountSlice";
import LayoutDashboard from "../../components/LayoutDashboard";

const ManageDiscountEdit = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const discData = useSelector((state) => state.discountReducer);

    useEffect(() => {
        dispatch(fetchDiscountData(params.UUID));
    }, [])

    return <LayoutDashboard>
        <div className="w-full">
        <TopBar title='Edit Discount' prevPage={() => { navigate('/manage/discount'); dispatch(clearDiscountData()) }} />
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
            onConfirm={() => {
                dispatch(updateDiscount(discData));
                navigate('/manage/discount');
            }}
        />

        </div>
    </LayoutDashboard>


};

export default ManageDiscountEdit;