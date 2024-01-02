import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { login, logout } from '../redux/slice/userSlice';
import NotFound from '../pages/NotFound';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, role, navigate }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currRole = useSelector((reducer) => reducer.userReducer.role);
  const [isLoading, setIsLoading] = useState(true);

  const authCheck = async () => {
    try {
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
      dispatch(logout());
      localStorage.removeItem('authToken');
      setIsLoading(false);
    }
  };

  const checkRole = (allowedRole) => {
    if (typeof allowedRole === 'string') {
      return allowedRole === currRole;
    } else if (typeof allowedRole === 'object') {
      return allowedRole.includes(currRole);
    }
  };

  useEffect(() => {
    if (currRole === '') {
      authCheck();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  if (checkRole(role)) {
    return children;
  } else {
    if (navigate) {
      return (
        <Navigate
          to={navigate}
          replace={true}
          state={{ previousPath: location.pathname }}
        />
      );
    }
    return <NotFound />;
  }
};

export default PrivateRoute;
