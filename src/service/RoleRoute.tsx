import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

interface RoleRouteProps {
  children: JSX.Element;
  allowedRoles: Array<'admin' | 'editor' | 'user'>; // Adapter aux rôles définis
}

interface UserFromLocalStorage {
  userId: number;
  email: string;
  role: 'admin' | 'user' | 'editor';
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const getUserFromLocalStorage = localStorage.getItem('user');

  let userFromLocalStorage: UserFromLocalStorage | null = null;

  if (getUserFromLocalStorage) {
    userFromLocalStorage = JSON.parse(getUserFromLocalStorage);
  }

  if (!user && !userFromLocalStorage) {
    // Redirigez si l'utilisateur n'est pas authentifié
    return <Navigate to="/login" />;
  }

  if (
    userFromLocalStorage &&
    !allowedRoles.includes(userFromLocalStorage.role)
  ) {
    // Redirigez si le rôle ne correspond pas
    alert('You are not allowed to access this page');
    return <Navigate to="/coupons" />;
  }

  return children;
};

export default RoleRoute;
