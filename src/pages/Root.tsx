import './Root.scss';
import Leftnav from '../components/Leftnav/Leftnav';
import { Outlet } from 'react-router-dom';

function Root() {
  return (
    <>
      <Leftnav />
      <div className="main">
        <Outlet />
      </div>
    </>
  );
}

export default Root;
