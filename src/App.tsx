import './App.css';
import Coupons from './components/Coupons/Coupons';
import Freeshipping from './components/Freeshipping/Freeshipping';
import Leftnav from './components/Leftnav/Leftnav';

function App() {
  return (
    <>
      <Leftnav />
      <Coupons />
      <Freeshipping />
    </>
  );
}

export default App;
