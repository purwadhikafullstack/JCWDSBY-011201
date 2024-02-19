import { GoChecklist } from "react-icons/go";
import { HiMiniEllipsisVertical, HiOutlineBuildingStorefront, HiPencilSquare } from "react-icons/hi2";
import { TiShoppingCart } from "react-icons/ti";
import { Dropdown } from "flowbite-react";
import { HiOutlineTrash } from "react-icons/hi";
import { CiDiscount1 } from "react-icons/ci";
import capitalize from "../helpers/capitalize";
import { useSelector } from "react-redux";

const CardManageDiscount = ({
    data,
    onDelete,
    onEdit,
}) => {
    const currentUserRole = useSelector(state => state.userReducer.role);

    const showCard = () => {
        const date = new Date(data.startTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ' - ' + new Date(data.endTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        let term;

        if(data.term === 'product') term = 'Product Discount';
        else term = capitalize(data.term);

        return <div className="flex-1">
            <div>
                <p className="font-bold lg:text-md">{data.name}</p>
                <p className="text-xs lg:text-sm">{date}</p>
            </div>
            <div className={`grid mt-2 gap-1 ${data.term === 'buy 1 get 1' && 'lg:gap-3'} ${data.term === 'product' && 'lg:gap-2'}`}>
                <div className="flex gap-1">
                    <GoChecklist className="self-center lg:text-md" />
                    <div className="text-sm lg:text-md">{term}</div>
                </div>
                <div className={`flex gap-1 ${currentUserRole === 'admin' && 'hidden'}`}>
                    <HiOutlineBuildingStorefront className="self-center lg:text-md" />
                    <div className="text-sm lg:text-md">{data.storeName}</div>
                </div>
                <div className={`flex gap-1 ${data.term === 'product' ? '' : data.term === 'buy 1 get 1' ? '' : 'hidden'}`}>
                    <TiShoppingCart className={`self-center lg:text-md`} />
                    <div className="text-sm lg:text-md">{data.productName}</div>
                </div>
                <div className={`flex gap-1 ${data.term === 'product' ? '' : data.term === 'min transaction' ? '' : 'hidden'}`}>
                    <CiDiscount1 className="self-center lg:text-md" />
                    <div className="text-sm lg:text-md">{data.type === 'percentage' ? `${data?.percentage*100}%` : `${data.nominal?.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0})}`}</div>
                </div>
                <div className={`grid lg:grid-flow-col text-sm gap-1 lg:text-md lg:flex-row lg:mt-3 ${data.term !== 'min transaction' && 'hidden'}`}>
                    <p>Min Transaction : <br className="hidden lg:block"/>{data?.minTransaction.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0})}</p>
                    <p>Limit : <br className="hidden lg:block"/>{data.limit}</p>
                    <p className="font-bold lg:text-md">{data.voucherCode}</p>
                </div>
            </div>
        </div>
    };

    return <div className="border shadow-lg rounded-md min-h-[7rem] p-4 lg:w-[365px] h-min lg:h-full">
            <div className=" flex h-full">
                {data && showCard()}
                <div className="grid">
                    <Dropdown
                        placement="left-start"
                        renderTrigger={() => (
                            <span className="hover:cursor-pointer">
                                <HiMiniEllipsisVertical className="w-6 h-6" />
                            </span>
                        )}
                    >
                        <Dropdown.Item icon={HiPencilSquare} onClick={onEdit}>
                            Edit
                        </Dropdown.Item>
                        <Dropdown.Item icon={HiOutlineTrash} onClick={onDelete}>
                            Delete
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            </div>
        </div>
};

export default CardManageDiscount;