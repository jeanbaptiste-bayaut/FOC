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
    // Get the user from the local storage
    const localStorageData = localStorage.getItem('user');

    // Check if the user is still authenticated
    if (localStorageData) {
      const parsedData: LocalStorageProps = JSON.parse(localStorageData);
      if (parsedData.expiry && parsedData.expiry > new Date().getTime()) {
        userFromLocalStorage = parsedData.value;
      } else {
        console.warn('Session expired or missing expiry');
        localStorage.removeItem('user'); // Clean expired data
      }
    }
  } catch (error) {
    console.error('Failed to parse localStorage data:', error);
    localStorage.removeItem('user'); // Clean data
  }

  const authenticatedUser = user || userFromLocalStorage;

  if (!authenticatedUser) {
    // If there is no authenticated user redirect to login
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(authenticatedUser.role)) {
    // If user is not allowed to access the page, show an alert and redirect to coupons
    alert('You are not allowed to access this page');
    return <Navigate to="/coupons" />;
  }

  return children;
};

export default RoleRoute;
