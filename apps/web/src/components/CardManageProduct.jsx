import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Dropdown } from "flowbite-react";

const CardManageProduct = ({
    image,
    productName,
    productUnit,
    price,
    discountPrice,
    stock,
    onEdit,
    onDelete,
}) => {
    const currentUserRole = useSelector((reducer) => reducer.userReducer.role);

    return <>
        <div className="border-gray-300 flex flex-col w-full h-48 md:h-64 lg:h-72 border-2 rounded-md relative cursor-pointer">
            <div className="flex flex-col w-full h-full">
                <div className="flex w-full h-[50%]">
                    <img
                        className="w-full h-full object-cover"
                        src={image}
                        alt={productName}
                    />
                </div>
                <div className="flex flex-col h-[50%] w-full px-1 justify-around bg-white">
                    <span className="text-sm font-bold line-clamp-1 ">{productName}</span>
                    <span className="text-xs font-light ">{productUnit}</span>
                    {discountPrice ? (
                        <div className="flex flex-col">
                            <div className="flex">
                                <span className="text-sm font-semibold text-blue-800">
                                    {discountPrice && discountPrice.toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'idr',
                                        maximumFractionDigits: 0
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs p-0.5 rounded-full bg-blue-800 text-white">
                                    {(((price - discountPrice) / price) * 100).toFixed() + '%'}
                                </span>
                                <span className=" line-through text-xs text-red-500">
                                    {price.toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'idr',
                                        maximumFractionDigits: 0
                                    })}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-1 items-center">
                            <span className="text-sm font-semibold h-fit">
                                {price && price.toLocaleString('id-ID', {
                                    style: 'currency',
                                    currency: 'idr',
                                    maximumFractionDigits: 0
                                })}
                            </span>
                        </div>
                    )}
                    <div className="flex mb-1">
                        <span className="text-xs font-thin flex-1">
                            {stock ? `stock: ${stock}` : 'Out of stock'}
                        </span>
                        <div >
                            <Dropdown placement="left-bottom" size='sm' dismissOnClick={false} renderTrigger={() => <button><BsThreeDots/></button>}>
                                <Dropdown.Item icon={FiEdit} onClick={onEdit}>Edit</Dropdown.Item>
                                <Dropdown.Item icon={MdDelete} onClick={onDelete}>Delete</Dropdown.Item>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
};

export default CardManageProduct;