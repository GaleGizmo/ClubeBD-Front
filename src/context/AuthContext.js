import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAvailableUsers, loginUser, logoutUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Intenta obtener el usuario del localStorage al iniciar
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    // Cargar usuarios disponibles al iniciar la aplicación
    fetchAvailableUsers();
  }, []);

  useEffect(() => {
    // Guarda el usuario en localStorage cada vez que cambie
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const fetchAvailableUsers = async () => {
    try {
      const users = await getAvailableUsers();
    
      setAvailableUsers(users);
    } catch (error) {
      console.error('Error fetching available users:', error);
    }
  };

  const login = async (userId) => {
    try {
      const userData = await loginUser(userId);
      setUser(userData);
      // Actualizar la lista de usuarios disponibles
      setAvailableUsers(availableUsers.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const logout = async () => {
    if (user) {
      try {
        console.log(user);
        await logoutUser(user._id);
        setUser(null);
        // Añadir el usuario de vuelta a la lista de disponibles
        setAvailableUsers([...availableUsers, user]);
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, availableUsers, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);