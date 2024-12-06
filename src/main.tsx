import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import RoleRoute from './service/RoleRoute.tsx';

import Root from './pages/Root.tsx';
import App from './App.tsx';
import Login from './components/Auth/Login/Login.tsx';
import Signin from './components/Auth/Signin/Signin.tsx';
import './index.scss';
import DropFile from './components/Upload/DropFile/DropFile.tsx';
import Report from './components/Report/Report.tsx';
import Export from './components/Export/Export.tsx';
import { AuthProvider } from './hooks/AuthContext.tsx';
import AdminPage from './components/Admin/Admin.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="/login" element={<Login />} />
      <Route
        path="/signin"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <Signin />
          </RoleRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <AdminPage />
          </RoleRoute>
        }
      />
      <Route
        path="/coupons"
        element={
          <RoleRoute allowedRoles={['editor', 'admin', 'user']}>
            <App />
          </RoleRoute>
        }
      />
      <Route
        path="/report"
        element={
          <RoleRoute allowedRoles={['editor', 'admin']}>
            <Report />
          </RoleRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <RoleRoute allowedRoles={['editor', 'admin']}>
            <DropFile />
          </RoleRoute>
        }
      />
      <Route
        path="/export"
        element={
          <RoleRoute allowedRoles={['editor', 'admin']}>
            <Export />
          </RoleRoute>
        }
      />
    </Route>
  )
);

root.render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
