import './Root.css';
import Leftnav from '../components/Leftnav/Leftnav';
import { Outlet } from 'react-router-dom';

function Root() {
  return (
    <>
      <Leftnav />
      <div className="root">
        <Outlet />
      </div>
    </>
  );
}

export default Root;
