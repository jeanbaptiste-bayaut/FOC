import './Leftnav.scss';
import { useAuth } from '../../../hooks/AuthContext';

function Leftnav() {
  const { logout } = useAuth();
  const { user } = useAuth();

  // Function to handle the logout removing the user and its facturation code from the local storage
  const handleLogout = () => {
    logout();
    localStorage.removeItem('factuCode');
  };

  return (
    <nav>
      <a href="/coupons">
        <h1>FOC REQUEST TOOL</h1>
      </a>
      <div className="section-nav-top">
        <ul className="nav-main">
          {user?.role === 'admin' && (
            <>
              <li>
                <a href="/signin">Signin</a>
              </li>
              <li>
                <a href="/admin">Admin</a>
              </li>
            </>
          )}
          <li>
            <a href="/coupons">Coupons</a>
          </li>
          {(user?.role === 'admin' || user?.role === 'editor') && (
            <>
              <li>
                <a href="/report">Report</a>
              </li>
              <li>
                <a href="/export">Export</a>
              </li>
              <li>
                <a href="/upload">Upload Coupons</a>
              </li>
            </>
          )}
        </ul>
        <section className="nav-connection">
          <ul>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/login" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </ul>
        </section>
      </div>
    </nav>
  );
}

export default Leftnav;
