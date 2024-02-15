import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { customTable } from "../../helpers/flowbiteCustomTheme";
import { useSelector } from "react-redux";

const StockReportTable = ({ data }) => {
  const currentUserRole = useSelector(state => state.userReducer.role);

  return <>
    {data ? !data.length ? <span>Data not available</span> :
      <Table theme={customTable}>
        <TableHead>
          <TableHeadCell >#</TableHeadCell>
          <TableHeadCell >Date</TableHeadCell>
          <TableHeadCell >Product Name</TableHeadCell>
          <TableHeadCell className={`${currentUserRole !== 'super' && 'hidden'}`}>Store</TableHeadCell>
          <TableHeadCell >Admin</TableHeadCell>
          <TableHeadCell className="w-min px-1 py-0">Initial Stock</TableHeadCell>
          <TableHeadCell className="w-min px-1 py-0">Stock Change</TableHeadCell>
          <TableHeadCell className="w-min px-1 py-0">End Stock</TableHeadCell>
          <TableHeadCell >Detail</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {data.map((val, index) => {
            const date = new Date(val.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            return <TableRow key={index}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="text-center">{date}</TableCell>
              <TableCell >{val.product}</TableCell>
              <TableCell className={`${currentUserRole !== 'super' && 'hidden'}`}>{val.storeName}</TableCell>
              <TableCell className="text-center">{val.admin}</TableCell>
              <TableCell className="text-center">{val.initialStock}</TableCell>
              <TableCell className="text-center">{val.stockChange}</TableCell>
              <TableCell className="text-center">{val.endStock}</TableCell>
              <TableCell className="text-center">{val.detail}</TableCell>
            </TableRow>
          })}
        </TableBody>
      </Table>
      : <span>Data not available</span>}
  </>
};

export default StockReportTable;