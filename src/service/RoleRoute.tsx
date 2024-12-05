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

  const localStorageData = localStorage.getItem('user');
  let userFromLocalStorage: UserFromLocalStorage | null = null;

  if (localStorageData) {
    try {
      const parsedData: LocalStorageProps = JSON.parse(localStorageData);
      if (parsedData.expiry > new Date().getTime()) {
        userFromLocalStorage = parsedData.value;
      } else {
        console.warn('Session expired');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error reading localStorage:', error);
      localStorage.removeItem('user');
    }
  }

  const authenticatedUser = user || userFromLocalStorage;

  if (!authenticatedUser) {
    // If there is no authenticated user redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(authenticatedUser.role)) {
    // If user is not allowed to access the page, show an alert and redirect to coupons
    return (
      <Navigate
        to="/coupons"
        replace
        state={{ alert: 'Unauthorized access' }}
      />
    );
  }

  return children;
};

export default RoleRoute;
