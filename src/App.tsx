import './App.css';
import Coupons from './components/Coupons/Coupons';
import Freeshipping from './components/Freeshipping/Freeshipping';
import Leftnav from './components/Leftnav/Leftnav';
import useAxiosInterceptors from './service/axiosInterceptor';

function App() {
  useAxiosInterceptors();

  return (
    <>
      <Leftnav />
      <Coupons />
      <Freeshipping />
    </>
  );
}

export default App;
