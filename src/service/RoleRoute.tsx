import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

interface RoleRouteProps {
  children: JSX.Element;
  allowedRoles: Array<'admin' | 'editor' | 'user'>;
}

interface LocalStorageProps {
  value: { userId: number; email: string; role: 'admin' | 'user' | 'editor' };
  expiry: number;
}

interface UserFromLocalStorage {
  userId: number;
  email: string;
  role: 'admin' | 'user' | 'editor';
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  let userFromLocalStorage: UserFromLocalStorage | null = null;

  try {
    const localStorageData = localStorage.getItem('user');
    if (localStorageData) {
      const parsedData: LocalStorageProps = JSON.parse(localStorageData);
      if (parsedData.expiry && parsedData.expiry > new Date().getTime()) {
        userFromLocalStorage = parsedData.value;
      } else {
        console.warn('Session expired or missing expiry');
        localStorage.removeItem('user'); // Nettoyez les données expirées
      }
    }
  } catch (error) {
    console.error('Failed to parse localStorage data:', error);
    localStorage.removeItem('user'); // Nettoyez en cas d'erreur
  }

  const authenticatedUser = user || userFromLocalStorage;

  if (!authenticatedUser) {
    // Si aucun utilisateur n'est authentifié
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(authenticatedUser.role)) {
    // Si l'utilisateur authentifié n'a pas les permissions nécessaires
    alert('You are not allowed to access this page');
    return <Navigate to="/coupons" />;
  }

  return children;
};

export default RoleRoute;
