import { GoChecklist } from "react-icons/go";
import { HiMiniEllipsisVertical, HiOutlineBuildingStorefront, HiPencilSquare } from "react-icons/hi2";
import { TiShoppingCart } from "react-icons/ti";
import { Dropdown } from "flowbite-react";
import { HiOutlineTrash } from "react-icons/hi";
import { CiDiscount1 } from "react-icons/ci";
import capitalize from "../helpers/capitalize";

const CardManageDiscount = ({
    data,
    onDelete,
    onEdit,
}) => {

    const showCard = () => {
        const date = new Date(data.startTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ' - ' + new Date(data.endTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        let term;

        if(data.term === 'product') term = 'Product Discount';
        else term = capitalize(data.term);

        return <div className="flex-1">
            <div>
                <p className="font-bold lg:text-xl">{data.name}</p>
                <p className="text-xs lg:text-sm">{date}</p>
            </div>
            <div className={`grid mt-2 gap-1 ${data.term === 'buy 1 get 1' && 'lg:gap-3'} ${data.term === 'product' && 'lg:gap-2'}`}>
                <div className="flex gap-1">
                    <GoChecklist className="self-center lg:text-xl" />
                    <div className="text-sm lg:text-xl">{term}</div>
                </div>
                <div className="flex gap-1">
                    <HiOutlineBuildingStorefront className="self-center lg:text-xl" />
                    <div className="text-sm lg:text-xl">{data.storeName}</div>
                </div>
                <div className={`flex gap-1 ${data.term === 'product' ? '' : data.term === 'buy 1 get 1' ? '' : 'hidden'}`}>
                    <TiShoppingCart className={`self-center lg:text-xl`} />
                    <div className="text-sm lg:text-xl">{data.productName}</div>
                </div>
                <div className={`flex gap-1 ${data.term === 'product' ? '' : data.term === 'min transaction' ? '' : 'hidden'}`}>
                    <CiDiscount1 className="self-center lg:text-xl" />
                    <div className="text-sm lg:text-xl">{data.type === 'percentage' ? `${data?.percentage*100}%` : `${data.nominal?.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0})}`}</div>
                </div>
                <div className={`flex flex-col text-sm gap-1 lg:text-md lg:gap-11 lg:flex-row lg:mt-3 ${data.term !== 'min transaction' && 'hidden'}`}>
                    <p>Min Transaction : <br className="hidden lg:block"/>{data?.minTransaction.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0})}</p>
                    <p>Limit : <br className="hidden lg:block"/>{data.limit}</p>
                    <p className="font-bold lg:text-lg">{data.voucherCode}</p>
                </div>
            </div>
        </div>
    };

    return <div className=" bg-white shadow-md rounded-md min-h-[7rem] p-3 lg:w-[400px] h-min lg:h-full">
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