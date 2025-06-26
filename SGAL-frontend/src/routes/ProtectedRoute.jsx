import React from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api/axios.js';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);

  React.useEffect(() => {
    const verifyAuth = async () => {
      try {
        console.log('Verificando autenticación...');
        await API.get('/auth/profile');
        console.log('Autenticación verificada correctamente');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setIsAuthenticated(false);
      }
    };
    verifyAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
};

export default ProtectedRoute;