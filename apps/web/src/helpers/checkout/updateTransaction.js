import API_CALL from '../API';

export const updateTransactionStatus = async (invoice, status) => {
  try {
    const response = await API_CALL.patch(
      `/transaction/${invoice}`,
      { status:status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      },
    );
    console.log("🚀 ~ updateTransactionStatus ~ response:", response)
  } catch (error) {
    console.log(error);
  }
};
