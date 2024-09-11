import './App.css';
import Coupons from './components/Coupons/Coupons';
import Login from './components/Login/Login';
import Signin from './components/Signin/Signin';
import Freeshipping from './components/Freeshipping/Freeshipping';
import DropFile from './components/DropFile/DropFile';

function App() {
  return (
    <>
      <Login />
      <Signin />
      <Coupons />
      <Freeshipping />
      <DropFile />
    </>
  );
}

export default App;
