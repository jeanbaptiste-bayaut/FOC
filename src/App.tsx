import './App.scss';
import Coupons from './components/CouponGenerator/Coupons/Coupons.tsx';
import Freeshipping from './components/CouponGenerator/Freeshipping/Freeshipping.tsx';
import useAxiosInterceptors from './service/axiosInterceptor';

function App() {
  useAxiosInterceptors();

  return (
    <>
      <Coupons />
      <Freeshipping />
    </>
  );
}

export default App;
