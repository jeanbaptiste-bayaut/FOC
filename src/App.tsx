import './App.scss';
import Coupons from './components/Coupons/Coupons';
import Freeshipping from './components/Freeshipping/Freeshipping';
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
