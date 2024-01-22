import { toast } from 'react-toastify';

const customToast = (status, message) => {
  if (status.toLowerCase() === 'success') {
    return toast.success(`${message}`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  } else if (status.toLowerCase() === 'error') {
    return toast.error(`${message}`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  }
};

export default customToast;
