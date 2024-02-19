import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown } from "flowbite-react";
import { HiOutlineTrash, HiPencilSquare, HiMiniEllipsisHorizontal } from 'react-icons/hi2';
import { customTable } from "../../helpers/flowbiteCustomTheme";
import { IMG_URL_PRODUCT } from "../../constants/imageURL";
import { useSelector } from "react-redux";

const ManageProductTable = ({ data, onEdit, onDelete, page }) => {
  const currentUserRole = useSelector((reducer) => reducer.userReducer.role);

  return <div className="grid overflow-x-auto">
    {data ? !data.length ? <span>Data not available</span> :
      <Table theme={customTable}>
        <TableHead>
          <TableHeadCell >#</TableHeadCell>
          <TableHeadCell >Product</TableHeadCell>
          <TableHeadCell >Weight</TableHeadCell>
          <TableHeadCell >Price</TableHeadCell>
          <TableHeadCell >Category</TableHeadCell>
          <TableHeadCell className={`${currentUserRole !== 'super' && 'hidden'}`}><span className="sr-only">Action</span></TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {data.map((val, index) => {
            return <TableRow key={index}>
              <TableCell className="text-center">{`${(page - 1) * 5 + index + 1}`}</TableCell>
              <TableCell>
                <div className="flex flex-col lg:flex-row gap-3 font-bold items-center">
                  <img className="object-contain w-24 h-24" src={IMG_URL_PRODUCT + val.product_images[0].image} />
                  {val.name}
                </div>
              </TableCell>
              <TableCell className="text-center">{val.weight + val.unit}</TableCell>
              <TableCell className="text-center">{val.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</TableCell>
              <TableCell className="text-center">{val.category.name}</TableCell>
              <TableCell className={`${currentUserRole !== 'super' && 'hidden'}`}>
                <Dropdown
                  renderTrigger={() => (
                    <span className="hover:cursor-pointer">
                      <HiMiniEllipsisHorizontal className="w-6 h-6" />
                    </span>
                  )}
                >
                  <Dropdown.Item
                    onClick={() => onEdit(val.name)}
                    icon={HiPencilSquare}
                  >
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => onDelete(val.id)}
                    icon={HiOutlineTrash}
                  >
                    Delete
                  </Dropdown.Item>
                </Dropdown>
              </TableCell>
            </TableRow>
          })}
        </TableBody>
      </Table>
      : <span>Data not available</span>}
  </div>
};

export default ManageProductTable;