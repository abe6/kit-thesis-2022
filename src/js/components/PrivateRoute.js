import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../firebase/auth'

const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();
    const { pathname } = useLocation();
  
    return currentUser ? (
      children
    ) : (
      <Navigate to="/login" state={{ from: pathname }} replace />
    );
  };

  export default PrivateRoute