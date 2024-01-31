import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import ContainerAdmin from "../../components/ContainerAdmin";
import LoadingSpinner from "../../components/LoadingSpinner";
import LayoutPageAdmin from "../../components/LayoutPageAdmin";
import { Button, Pagination } from "flowbite-react";
// import SearchBar from "../../components/SearchBar";
import { useNavigate, useSearchParams } from "react-router-dom";
import CardManageDiscount from "../../components/CardManageDiscount";
import ModalConfirm from "../../components/modal/ModalConfirm";
import { deleteDiscount, getDiscount } from "../../helpers/queryData";

const ManageDiscount = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [discountData, setDiscountData] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [discID, setDiscID] = useState(null);
    const [totalPage, setTotalPage] = useState(1);

    useEffect(() => {
        getDiscount(setDiscountData, setIsLoading, setTotalPage);
    }, []);

    const onPageChange = (page) => {
        setSearchParams((prev) => {
            prev.set('page', page);
            return prev;
        });
    };

    return <>
        <ContainerAdmin>
            <AdminSidebar />
            <LoadingSpinner size={16} isLoading={isLoading} />
            <ModalConfirm
                show={openModal}
                header={'Delete Discount'}
                message={'Are you sure you want to delete discount'}
                onClose={() => setOpenModal(false)}
                onConfirm={() => {setOpenModal(false); deleteDiscount(discID, setIsLoading, getDiscount(setDiscountData, setIsLoading, setTotalPage)); setDiscID(null); }}
            />
            <LayoutPageAdmin title='Manage Discount'>
                <div className='grid grid-cols-1 max-w-full overflow-x-auto mb-5'>
                    <div className="flex justify-between">
                        <Button onClick={() => navigate('/manage/discount/create')}>Create Discount</Button>
                    </div>
                    <div className="mt-5 grid gap-3 lg:grid-cols-4 lg:gap-y-10">
                        {discountData && discountData.map((val, idx) => <CardManageDiscount key={idx} data={val} onDelete={() => {setOpenModal(true); setDiscID(val.id)}} />)}
                    </div>
                </div>
                <div className='grid max-w-full overflow-x-auto pb-4 justify-items-center lg:justify-items-end'>
                    <Pagination
                        className="lg:hidden"
                        layout='navigation'
                        onPageChange={onPageChange}
                        currentPage={Number(searchParams.get('page')) || 1}
                        totalPages={totalPage}
                        showIcons
                    />
                    <Pagination
                        className="hidden lg:block"
                        layout='pagination'
                        onPageChange={onPageChange}
                        currentPage={Number(searchParams.get('page')) || 1}
                        totalPages={totalPage}
                        showIcons
                    />
                </div>
            </LayoutPageAdmin>
        </ContainerAdmin>
    </>
};

export default ManageDiscount;