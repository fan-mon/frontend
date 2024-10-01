import './App.css';
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from "react-router-dom";
import ChatPage from "./pages/chat/ChatPage";
import GoodsList from './pages/shop/goods/GoodsList';
import GoodsDetail from './pages/shop/goods/GoodsDetail';
import GoodsForm from './pages/management/goods/GoodsForm';
import Header from './pages/common/Header';
import CartList from './pages/shop/cart/CartList';
import CartBuying from './pages/shop/cart/CartBuying';
import CartBought from './pages/shop/cart/CartBought';

function App() {
    // 유저 하드코딩
    // 세션 유지 이후 변경 예정
    const user='summer'

  return (
      <BrowserRouter>
        <div className='header-wrap'>
          <Header />
          <div className="content">
              <Routes>
                <Route path="/chat" element={<ChatPage user={user}/>} />
                <Route path="/shop/goods" element={<GoodsList/>}/>
                <Route path="/shop/goods/detail" element={<GoodsDetail/>}/>
                <Route path="/shop/cart" element={<CartList/>}/>
                <Route path="/shop/cart/buying" element={<CartBuying/>}/>
                <Route path="/shop/cart/bought" element={<CartBought/>}/>
                <Route path="/management/goodsform" element={<GoodsForm/>}/>
              </Routes>
          </div>
        </div>
      </BrowserRouter>
  );
}

export default App;