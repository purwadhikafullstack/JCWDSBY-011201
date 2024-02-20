import customToast from "../../utils/toast";
import API_CALL from "../API";

export const sendingOrderForAdmin = async (status, invoice, resi,setOpenModal) => {
    try {
      const response = await API_CALL.patch(
        '/transaction/admin/sending',
        { status, invoice, resi },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
          },
        },
      );
      customToast('success', response.data.message);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      customToast('error', error.response.data.message);
    }
  };

  export const cancelOrdersForAdmin = async (status, invoice,setOpenModal) => {
    try {
      const response = await API_CALL.patch(
        '/transaction/admin/cancel',
        { status, invoice },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
          },
        },
      );
      customToast('success', response.data.message);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      customToast('error', error.response.data.message);
    }
  };

  export const updateStatusForTransferAdmin = async (status, invoice,setOpenModal) => {
    try {
      const response = await API_CALL.patch(
        '/transaction/proof/update',
        { status, invoice },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
          },
        },
      );
      customToast('success', response.data.message);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      customToast('error', error.response.data.message);
    }
  };