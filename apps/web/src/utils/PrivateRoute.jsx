import { useEffect, useState } from 'react';
import API_CALL from '../helpers/API';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { login } from '../redux/slice/userSlice';
import NotFound from '../pages/NotFound';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role, navigate }) => {
  const dispatch = useDispatch();
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
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    authCheck();
  }, []);

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  if (currRole === role) {
    return children;
  } else {
    if (navigate) {
      return <Navigate to={navigate} />;
    }
    return <NotFound />;
  }
};

export default PrivateRoute;
