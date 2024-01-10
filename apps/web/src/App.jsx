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
import UserFindCategory from './pages/UserFIndCategory';
import UserProductDetail from './pages/UserProductDetail';
import ManageProduct from './pages/admin/ManageProduct';
import CreateProduct from './pages/admin/CreateProduct';
import EditProduct from './pages/admin/EditProduct';
import Inventory from './pages/admin/Inventory';
import ManageAdmin from './pages/admin/ManageAdmin';
import RegisteredUser from './pages/admin/RegisteredUser';
import ManageStore from './pages/admin/ManageStore';
import ChangePassword from './pages/admin/ChangePassword';
import { Form, Formik } from 'formik';
import EditAdmin from './pages/admin/EditAdmin';
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
        <Route path="/category" element={<UserFindCategory />} />
        <Route
          path="/product/:name"
          element={<UserProductDetail />}
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
        <Route
          path="/manage/category"
          element={
            <PrivateRoute role={['admin', 'super']}>
              <ManageCategories />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage/product"
          element={
            <PrivateRoute role={['admin', 'super']}>
              <ManageProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage/product/create"
          element={
            <PrivateRoute role={['super']}>
              <CreateProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage/product/edit/:id"
          element={
            <PrivateRoute role={['super']}>
              <EditProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage/inventory"
          element={
            <PrivateRoute role={['admin', 'super']}>
              <Inventory />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage/admin"
          element={
            <PrivateRoute role={'super'}>
              <ManageAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage/admin/password"
          element={
            <PrivateRoute role={'super'}>
                  <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage/admin/profile"
          element={
            <PrivateRoute role={'super'}>
                  <EditAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage/user"
          element={
            <PrivateRoute role={'super'}>
              <RegisteredUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage/store"
          element={
            <PrivateRoute role={['admin', 'super']}>
              <ManageStore />
            </PrivateRoute>
          }
        />
        {/* Afra */}
        <Route path="/cart" element={<Cart />} />
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
