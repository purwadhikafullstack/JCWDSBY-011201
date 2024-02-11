import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown } from "flowbite-react";
import { HiOutlineTrash, HiPencilSquare, HiMiniEllipsisHorizontal } from 'react-icons/hi2';
import { customTable } from "../../helpers/flowbiteCustomTheme";
import { useSelector } from "react-redux";

const ManageInventoryTable = ({ data, onEdit, onDelete, page }) => {
  const currentUser = useSelector(state => state.userReducer);

  return <div className="grid overflow-x-auto">
    {data ? !data.length ? <span>Data not available</span> :
      <Table theme={customTable}>
        <TableHead>
          <TableHeadCell >#</TableHeadCell>
          <TableHeadCell >Product Name</TableHeadCell>
          <TableHeadCell >Category</TableHeadCell>
          <TableHeadCell >Stock</TableHeadCell>
          {currentUser.role === 'super' && <TableHeadCell>Store</TableHeadCell>}
          <TableHeadCell ><span className="sr-only">Action</span></TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {data.map((val, index) => {
            return <TableRow key={index}>
              <TableCell className="text-center">{`${(page - 1) * 10 + index + 1}`}</TableCell>
              <TableCell>{val.product.name}</TableCell>
              <TableCell className="text-center">{val.product.category.name}</TableCell>
              <TableCell className="text-center">{val.stock}</TableCell>
              {currentUser.role === 'super' && <TableCell className="text-center">{`${val.store.name}`}</TableCell>}
              <TableCell className="text-center">
                <Dropdown
                  renderTrigger={() => (
                    <span className="hover:cursor-pointer">
                      <HiMiniEllipsisHorizontal className="w-6 h-6" />
                    </span>
                  )}
                >
                  <Dropdown.Item
                    onClick={() => onEdit(val.id)}
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

export default ManageInventoryTable;