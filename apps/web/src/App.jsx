import { Routes, Route, useNavigate } from 'react-router-dom';
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
import Cart from './pages/Cart';
import { gapi } from 'gapi-script';
import { useEffect, useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import { useDispatch, useSelector } from 'react-redux';
import NotFound from './pages/NotFound';
import UserProfile from './pages/UserProfile';
import PrivateRoute from './utils/PrivateRoute';
import Loader from './components/Loader';
import { login, logout } from './redux/slice/userSlice';
import API_CALL from './helpers/API';
import UserProfileDetail from './pages/UserProfileDetail';
import UserChangePassword from './pages/UserChangePassword';
import UserAddressList from './pages/UserAddressList';
import UserAddAddress from './pages/UserAddAddress';
import UserEditAddress from './pages/UserEditAddress';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  // Wahyu Widiantoro
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const globalUser = useSelector((reducer) => reducer.userReducer);

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
    async function checkAuth() {
      try {
        console.log(!localStorage.getItem('authToken'));
        if (!localStorage.getItem('authToken')) {
          throw 'Token Not Found';
        }
        const token = localStorage.getItem('authToken');
        const result = await API_CALL.get('/auth/keep-login', {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(login(result.data.result));
        localStorage.setItem('authToken', result.data.result.token);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        console.log('Lah sini');
        dispatch(logout());
        localStorage.removeItem('authToken');
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  return (
    <>
      <Routes>
        {/* User Side */}
        {/* Wahyu Widiantoro */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/forgot/reset-password" element={<NewPassword />} />
        <Route path="/signup/verify-account" element={<VerifyAccount />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute role={'user'} navigate={'/login'}>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/detail"
          element={
            <PrivateRoute role={'user'} navigate={'/login'}>
              <UserProfileDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/change-password"
          element={
            <PrivateRoute role={'user'} navigate={'/login'}>
              <UserChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/address"
          element={
            <PrivateRoute role={'user'} navigate={'/login'}>
              <UserAddressList />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/address/create"
          element={
            <PrivateRoute role={'user'} navigate={'/login'}>
              <UserAddAddress />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/address/:id"
          element={
            <PrivateRoute role={'user'} navigate={'/login'}>
              <UserEditAddress />
            </PrivateRoute>
          }
        />
        {/* Afra */}
        <Route
          path="/cart"
          element={
            <PrivateRoute role={'user'} navigate={'/login'}>
              <Cart />
            </PrivateRoute>
          }
        />
        {/* Admin Side */}
        {/* Wahyu Widiantoro */}
        <Route path="/manage/login" element={<LoginAdmin />} />
        <Route
          path="/manage/dashboard"
          element={
            <PrivateRoute role={['admin', 'super']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        {/* Fahmi */}
        <Route path="/manage/category" element={<ManageCategories />} />
        {/* Not Found */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
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
    </>
  );
}

export default App;
