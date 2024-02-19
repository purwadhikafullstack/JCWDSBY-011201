import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import { useEffect, useState } from 'react';
import API_CALL from '../../helpers/API';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useSelector } from 'react-redux';
import ModalAddInventory from '../../components/modal/ModalAddInventory';
import ModalConfirm from '../../components/modal/ModalConfirm';
import ModalEditInventory from '../../components/modal/ModalEditInventory';
import { useSearchParams } from 'react-router-dom';
import LayoutDashboard from '../../components/LayoutDashboard';
import { onPageChange } from '../../helpers/pagination';
import customToast from '../../utils/toast';
import ManageInventoryTable from '../../components/table/ManageInventoryTable';
import ResponsivePagination from '../../components/ResponsivePagination';
import ToolbarInventory from '../../components/ToolbarInventory';

const Inventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser = useSelector(state => state.userReducer);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [openModal, setOpenModal] = useState({ add: false, edit: false, confirmAdd: false, confirmEdit: false });
  const [required, setRequired] = useState({ addStock: false, editStock: false });
  const [data, setData] = useState({ productId: null, storeId: null, stock: null });
  const [editData, setEditData] = useState({ invId: null, product: null, store: null, stock: null });
  const [isOpen, setIsOpen] = useState(false);
  const [deleteInventoryId, setDeleteInventoryId] = useState(null);

  useEffect(() => {
    getData();
  }, [searchParams])

  const getData = async () => {
    setIsLoading(true);
    if (currentUser.role === 'super') {
      const res = await API_CALL.get('inventory', {
        params: { limit: 10, store: searchParams.get('store'), page: searchParams.get('page'), sort: searchParams.get('sort'), category: searchParams.get('category'), q: searchParams.get('q') },
      });
      if (res) {
        setItems(res.data.result.rows);
        setTotalPage(Math.ceil(res.data.result.count / 10));
        setIsLoading(false);
      }
    }
    if (currentUser.role === 'admin') {
      const res = await API_CALL.get('inventory', {
        params: { limit: 10, page: searchParams.get('page'), sort: searchParams.get('sort'), category: searchParams.get('category'), q: searchParams.get('q') },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (res) {
        setItems(res.data.result.rows);
        setTotalPage(Math.ceil(res.data.result.count / 10));
        setIsLoading(false);
      }
    }

  };

  const handleEdit = (id) => {
    setOpenModal({ ...openModal, edit: true });
    setEditData({
      invId: id,
      product: items.find(item => item.id === id).product.name,
      store: items.find(item => item.id === id).store.name,
      stock: items.find(item => item.id === id).stock
    });
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    const res = await API_CALL.delete(`inventory/${id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    if (res) {
      getData();
      setIsLoading(false);
    }
  };

  const handleAddInventory = async () => {
    try {
      if (!data.stock) {
        setRequired({ ...required, addStock: true });
        return setOpenModal({ ...openModal, add: true, confirmAdd: false });
      }
      setRequired({ ...required, addStock: false });
      const inventoryData = {
        productId: parseInt(data.productId),
        storeId: parseInt(data.storeId),
        stock: parseInt(data.stock),
      };
      setOpenModal({ ...openModal, add: false, confirmAdd: false });
      setIsLoading(true);
      await API_CALL.post('inventory', inventoryData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setIsLoading(false);
      getData();
    } catch (error) {
      setOpenModal({ ...openModal, add: false, confirmAdd: false });
      setIsLoading(false);
      if (error.response.status === 409) return customToast('error', 'Inventory already exists')
    }
  };

  const handleEditInventory = async () => {
    if (!editData.stock) {
      setRequired({ ...required, editStock: true });
      return setOpenModal({ ...openModal, edit: true, confirmEdit: false });
    }
    setRequired({ ...required, editStock: false });
    setOpenModal({ ...openModal, edit: false, confirmEdit: false });
    setIsLoading(true);
    await API_CALL.patch(`inventory/${editData.invId}`, {
      stock: parseInt(editData.stock),
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    setIsLoading(false);
    getData();
  };

  return <>
    <LayoutDashboard>
      <LoadingSpinner isLoading={isLoading} size={20} />
      <ModalConfirm
        show={openModal.confirmAdd || openModal.confirmEdit}
        onClose={() => setOpenModal({ ...openModal, confirmAdd: false, confirmEdit: false })}
        onConfirm={openModal.confirmAdd ? handleAddInventory : handleEditInventory}
        header={openModal.confirmAdd ? 'Add Inventory' : 'Edit Inventory'}
        message={openModal.confirmAdd ? 'Are you sure you want to add inventory?' : 'Are you sure you want to edit inventory?'}
      />
      <LayoutPageAdmin title='Manage Inventory'>
        <div className='grid grid-cols-1 max-w-full overflow-x-auto '>
          <ToolbarInventory
          setIsLoading={setIsLoading}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          onAddInventory={() => setOpenModal({ ...openModal, add: true })}
          />
          <ManageInventoryTable
            data={items}
            page={(searchParams.get('page') || 1)}
            onDelete={(id) => { setDeleteInventoryId(id); setIsOpen(true); }}
            onEdit={(id) => handleEdit(id)}
          />
          <ModalAddInventory
            isOpen={openModal.add}
            onClose={() => { setOpenModal({ ...openModal, add: false }); setRequired({ ...required, addStock: false }); }}
            onAdd={(e) => { setData({ ...data, productId: e.productId, storeId: e.storeId, stock: e.stock }); setOpenModal({ ...openModal, confirmAdd: true }); }}
            onError={required.addStock}
          />
          <ModalEditInventory
            isOpen={openModal.edit}
            onClose={() => { setOpenModal({ ...openModal, edit: false }); setRequired({ ...required, editStock: false }); }}
            data={editData}
            onChangeStock={(e) => { setEditData({ ...editData, stock: e.target.value }); setRequired({ ...required, editStock: false }); }}
            onError={required.editStock}
            onSave={() => setOpenModal({ ...openModal, confirmEdit: true })}
          />
          <div className="mt-3 mb-10">
            <ResponsivePagination
              currentPage={Number(searchParams.get('page')) || 1}
              totalPages={totalPage}
              onPageChange={(page) => onPageChange(page, setSearchParams)}
            />
          </div>
          <ModalConfirm
          show={isOpen}
          header={'Delete Inventory'}
          message={'Are you sure want to delete inventory?'}
          onClose={() => setIsOpen(false)}
          onConfirm={() => { setIsOpen(false); deleteInventoryId && handleDelete(deleteInventoryId);}}
          />
        </div>
      </LayoutPageAdmin>
    </LayoutDashboard>
  </>
};

export default Inventory;