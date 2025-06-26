import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios.js';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde localStorage al inicio
  useEffect(() => {
    // Verificar autenticación al cargar la aplicación
    const verifyAuth = async () => {
      try {
        console.log('Verificando autenticación en UserContext...');
        
        // Primero intentar recuperar del localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          console.log('Usuario encontrado en localStorage:', storedUser);
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Verificar con el backend que la sesión sigue válida
          try {
            await API.get('/auth/profile');
            console.log('Sesión verificada con el backend');
          } catch (error) {
            console.error('Error verificando sesión con backend:', error);
            // Si hay error, limpiar la sesión
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          console.log('No hay usuario en localStorage');
        }
      } catch (error) {
        console.error('Error en verificación de autenticación:', error);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Función para iniciar sesión y guardar token + usuario
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Nueva función para actualizar el usuario
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
