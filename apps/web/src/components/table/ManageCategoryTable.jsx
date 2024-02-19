import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown } from "flowbite-react";
import { HiOutlineTrash, HiPencilSquare, HiMiniEllipsisHorizontal} from 'react-icons/hi2';
import { customTable } from "../../helpers/flowbiteCustomTheme";
import { IMG_URL_CATEGORY } from '../../constants/imageURL';
import { useSelector } from "react-redux";

const ManageCategoryTable = ({ data, onEdit, onDelete, page }) => {
  const currentUserRole = useSelector((reducer) => reducer.userReducer.role);

  return <div className="grid overflow-x-auto">
    {data ? !data.length ? <span>Data not available</span> :
      <Table theme={customTable}>
        <TableHead>
          <TableHeadCell >#</TableHeadCell>
          <TableHeadCell >Category</TableHeadCell>
          <TableHeadCell >Image</TableHeadCell>
          <TableHeadCell >Product Count</TableHeadCell>
          <TableHeadCell className={`${currentUserRole !== 'super' && 'hidden'}`}><span className="sr-only">Action</span></TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {data.map((val, index) => {
            return <TableRow key={index}>
              <TableCell className="text-center">{`${(page - 1) * 4 + index + 1}`}</TableCell>
              <TableCell className="text-center">{val.name}</TableCell>
              <TableCell >
                <img src={IMG_URL_CATEGORY + val.image} className="object-cover w-36 m-auto" />
              </TableCell>
              <TableCell className="text-center">{val.productCount}</TableCell>
              <TableCell className={`${currentUserRole !== 'super' && 'hidden'}`}>
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

export default ManageCategoryTable;