import {
  HiOutlineExclamationCircle,
  HiOutlineTrash,
  HiPencilSquare,
  HiMiniEllipsisHorizontal,
} from 'react-icons/hi2';
import { Badge, Button, Modal, Dropdown, Table } from 'flowbite-react';

const ManageStoreTable = ({
  storeData,
  onClickSetMain,
  onClickDelete,
  onClickEdit,
  openModalDelete,
  openModalMain,
  onCloseModalDelete,
  onCloseModalMain,
  onHandleSetMain,
  onHandleDelete,
}) => {
  return (
    <>
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Branch Name</Table.HeadCell>
          <Table.HeadCell>Branch Admin</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Action</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {storeData &&
            storeData.map((value) => (
              <Table.Row
                key={value.UUID}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 ">
                  {value.name}
                  {value.isMain && (
                    <Badge
                      color={'indigo'}
                      className="ml-2 w-fit inline font-bold"
                    >
                      Main Branch
                    </Badge>
                  )}
                </Table.Cell>
                <Table.Cell>{value.user.name}</Table.Cell>
                <Table.Cell className="line-clamp-2">
                  {value.address}, {value.district.districtName},{' '}
                  {value.city.cityName}, {value.province.provinceName}
                </Table.Cell>
                <Table.Cell>
                  <Dropdown
                    label=""
                    renderTrigger={() => (
                      <span className="hover:cursor-pointer">
                        <HiMiniEllipsisHorizontal className="w-6 h-6" />
                      </span>
                    )}
                  >
                    <Dropdown.Item
                      onClick={() => {
                        onClickEdit(value.UUID);
                      }}
                      icon={HiPencilSquare}
                    >
                      Edit Branch
                    </Dropdown.Item>
                    <Dropdown.Item
                      disabled={value.isMain ? true : false}
                      onClick={() => {
                        onClickSetMain(value.UUID);
                      }}
                      icon={HiPencilSquare}
                    >
                      Set Main
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        onClickDelete(value.UUID);
                      }}
                      icon={HiOutlineTrash}
                    >
                      Delete Branch
                    </Dropdown.Item>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <Modal show={openModalMain} size="md" onClose={onCloseModalMain} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to change main branch?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="blue" onClick={onHandleSetMain}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={onCloseModalMain}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={openModalDelete}
        size="md"
        onClose={onCloseModalDelete}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this branch?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={onHandleDelete}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={onCloseModalDelete}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ManageStoreTable;
