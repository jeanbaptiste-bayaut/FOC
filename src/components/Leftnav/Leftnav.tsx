import './Leftnav.scss';

function Leftnav() {
  return (
    <nav>
      <a href="/">
        <h1>FOC REQUEST TOOL</h1>
      </a>

      <ul>
        <li>
          <a href="/signin">Signin</a>
        </li>
        <li>
          <a href="/login">Login</a>
        </li>
        <li>
          <a href="/coupons">Coupons</a>
        </li>
        <li>
          <a href="/report">Report</a>
        </li>
        <li>
          <a href="/export">Export</a>
        </li>
        <li>
          <a href="/upload">Upload Coupons</a>
        </li>
      </ul>
    </nav>
  );
}

export default Leftnav;
