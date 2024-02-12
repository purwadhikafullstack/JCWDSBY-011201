import { Table, TableHead,TableHeadCell, TableBody, TableRow, TableCell } from "flowbite-react";
import { customTable } from "../../helpers/flowbiteCustomTheme";

const MonthlySalesReportTable = ({ data, page }) => {
  return <>
    {data ? !data.length ? <span>Data not available</span> :
      <Table theme={customTable}>
        <TableHead>
          <TableHeadCell >#</TableHeadCell>
          <TableHeadCell >Month</TableHeadCell>
          <TableHeadCell >Total Sales</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {data.map((val, index) => {
            return <TableRow key={index}>
              <TableCell className="text-center">{`${(page - 1) * 5 + index + 1}`}</TableCell>
              <TableCell className="text-center">{val.month}</TableCell>
              <TableCell className="text-center">{val.salesTotal}</TableCell>
            </TableRow>
          })}
        </TableBody>
      </Table>
      : <span>Data not available</span>}
  </>
};

export default MonthlySalesReportTable;