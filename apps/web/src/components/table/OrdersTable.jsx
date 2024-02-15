import React from 'react';
import {
    HiMiniEllipsisHorizontal
} from 'react-icons/hi2';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    Dropdown
} from 'flowbite-react';
import { customTable } from '../../helpers/flowbiteCustomTheme';
export function OrdersTable({
    order,
  caseStatus,
  getOrderDetails,
  setOrderDetails,
  setOpenModal,
  openModal,
}) {
  return (
    <Table theme={customTable}>
      <TableHead>
        <TableHeadCell>Invoice</TableHeadCell>
        <TableHeadCell>Payment Method</TableHeadCell>
        <TableHeadCell>Total</TableHeadCell>
        <TableHeadCell>Status</TableHeadCell>
        <TableHeadCell>Time</TableHeadCell>
        <TableHeadCell>Action</TableHeadCell>
      </TableHead>
      <TableBody className="divide-y">
        {order.map((val, index) => {
          return (
            <TableRow key={index}>
              <TableCell>
                <div className="flex flex-col text-sm lg:flex-row gap-3 font-bold items-center">
                  {val.invoice}
                </div>
              </TableCell>
              <TableCell className="text-center capitalize font-semibold">
                {val.paymentMethod}
              </TableCell>
              <TableCell className="text-center font-semibold">
                {val.paymentTotal.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0,
                })}
              </TableCell>
              <TableCell className="text-center">
                {' '}
                {caseStatus(val.paymentStatus)}
              </TableCell>
              <TableCell className="text-center text-sm">
                {' '}
                {new Date(val.createdAt).toLocaleString('en-GB', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </TableCell>
              <TableCell className="text-center">
                <Dropdown
                  renderTrigger={() => (
                    <span className="hover:cursor-pointer">
                      <HiMiniEllipsisHorizontal className="w-6 h-6" />
                    </span>
                  )}
                >
                  <Dropdown.Item
                    onClick={() => {
                      getOrderDetails(val.invoice, setOrderDetails);
                      setOpenModal(!openModal);
                    }}
                  >
                    Open Details
                  </Dropdown.Item>
                </Dropdown>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
