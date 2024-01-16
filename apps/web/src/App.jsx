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
import CheckAuth from './helpers/checkAuth';
import { setStore } from './redux/slice/storeSlice';
import ManageStoreAdd from './pages/admin/ManageStoreAdd';
import ManageStoreUpdate from './pages/admin/ManageStoreUpdate';
import ChangePassword from './pages/admin/ChangePassword';
import EditAdmin from './pages/admin/EditAdmin';
import getNearestStore from './helpers/getNearestStore';
import UserChangeEmail from './pages/UserChangeEmail';
import VerifyEmail from './pages/VerifyEmail';
import AddInventory from './pages/admin/AddInventory';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  // Wahyu Widiantoro
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const globalUser = useSelector((reducer) => reducer.userReducer);
  const currStore = useSelector((reducer) => reducer.storeReducer);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope:
          'email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
      });
    }
    gapi.load('client:auth2', start);
  });

  useEffect(() => {
    async function validateAuth() {
      try {
        if (globalUser.name === '') {
          const authResult = await CheckAuth();
          if (!authResult) {
            throw 'Authentication failed';
          }
          dispatch(login(authResult));
          localStorage.setItem('authToken', authResult.token);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        dispatch(logout());
        localStorage.removeItem('authToken');
        setIsLoading(false);
      }
    }
    validateAuth();
  }, []);

  useEffect(() => {
    if (currStore.storeName === undefined) {
      navigator.geolocation.getCurrentPosition(
        async (loc) => {
          try {
            const result = await getNearestStore(
              loc.coords.latitude,
              loc.coords.longitude,
            );
            dispatch(setStore(result.payload));
          } catch (error) {
            console.log(error);
          }
        },
        async (error) => {
          try {
            const result = await getNearestStore();
            dispatch(setStore(result.payload));
          } catch (err) {
            console.log(err);
          }
        },
      );
    }
  }, [currStore]);

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
        <Route path="/login/verify-email" element={<VerifyEmail />} />
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
          path="/profile/change-email"
          element={
            <PrivateRoute role={'user'} navigate={'/login'}>
              <UserChangeEmail />
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
        <Route path="/product/:name" element={<UserProductDetail />} />

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
        <Route
          path="/manage/store/create"
          element={
            <PrivateRoute role={'super'}>
              <ManageStoreAdd />
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
          path="/manage/product/edit/:name"
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
          path="/manage/inventory/create"
          element={
            <PrivateRoute role={['admin', 'super']}>
              <AddInventory />
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
        <Route
          path="/manage/store/:id"
          element={
            <PrivateRoute role={['admin', 'super']}>
              <ManageStoreUpdate />
            </PrivateRoute>
          }
        />
        {/* Afra */}
        <Route path="/cart" element={<Cart />} />
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
