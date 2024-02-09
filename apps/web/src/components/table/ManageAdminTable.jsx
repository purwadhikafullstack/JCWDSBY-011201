import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown } from "flowbite-react";
import { HiOutlineTrash, HiPencilSquare, HiMiniEllipsisHorizontal} from 'react-icons/hi2';
import { customTable } from "../../helpers/flowbiteCustomTheme";

const ManageAdminTable = ({data, page, onEdit, onDelete, onChangePassword}) => {
  return <div className="grid overflow-x-auto">
  {data ? !data.length ? <span>Data not available</span> :
    <Table theme={customTable}>
      <TableHead>
        <TableHeadCell >#</TableHeadCell>
        <TableHeadCell >Name</TableHeadCell>
        <TableHeadCell >Email</TableHeadCell>
        <TableHeadCell ><span className="sr-only">Action</span></TableHeadCell>
      </TableHead>
      <TableBody className="divide-y">
        {data.map((val, index) => {
          return <TableRow key={index}>
            <TableCell className="text-center">{`${(page - 1) * 10 + index + 1}`}</TableCell>
            <TableCell >{val.name}</TableCell>
            <TableCell >{val.email}</TableCell>
            <TableCell className="text-center">
            <Dropdown
                  renderTrigger={() => (
                    <span className="hover:cursor-pointer">
                      <HiMiniEllipsisHorizontal className="w-6 h-6" />
                    </span>
                  )}
                >
                  <Dropdown.Item
                    onClick={() => onEdit(val)}
                    icon={HiPencilSquare}
                  >
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => onChangePassword(val.uuid)}
                    icon={HiPencilSquare}
                  >
                    Change Password
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => onDelete(val.uuid)}
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
}

export default ManageAdminTable;