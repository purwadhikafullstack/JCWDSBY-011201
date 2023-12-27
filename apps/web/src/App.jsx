import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ManageCategories from './pages/admin/ManageCategories';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Forgot from './pages/Forgot';
import NewPassword from './pages/NewPassword';
import VerifyAccount from './pages/VerifyAccount';
import LoginAdmin from './pages/LoginAdmin';
import Landing from './pages/Landing';
import Cart from './pages/cart';
import { gapi } from 'gapi-script';
import { useEffect, useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import Loader from './components/Loader';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  // Wahyu Widiantoro
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: '',
      });
    }
    gapi.load('client:auth2', start);
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [window.location.pathname]);

  // Fahmi

  // Afra

  return (
    <>
      <Routes>
        {/* Wahyu Widiantoro */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/forgot/reset-password" element={<NewPassword />} />
        <Route path="/signup/verify-account" element={<VerifyAccount />} />
        <Route path="/auth/login" element={<LoginAdmin />} />
        <Route path="/auth/dashboard" element={<AdminDashboard />} />
        {/* Fahmi */}
        <Route path="/manage/category" element={<ManageCategories />} />
        {/* Afra */}
        <Route path="/cart" element={<Cart />} />

      </Routes>
      {/* Wahyu Widiantoro */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Loader isLoading={isLoading} />
      {/* Wahyu Widiantoro */}
    </>
  );
}

export default App;
