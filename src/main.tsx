import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import Root from './pages/Root.tsx';
import App from './App.tsx';
import Login from './components/Login/Login.tsx';
import Signin from './components/Signin/Signin.tsx';
import './index.css';
import DropFile from './components/DropFile/DropFile.tsx';
import Report from './components/Report/Report.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/coupons" element={<App />} />
      <Route path="/report" element={<Report />} />
      <Route path="/upload" element={<DropFile />} />
    </Route>
  )
);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
