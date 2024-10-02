import './App.css';
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from "react-router-dom";
import ChatPage from "./pages/chat/ChatPage";
import GoodsList from './pages/shop/goods/GoodsList';
import GoodsDetail from './pages/shop/goods/GoodsDetail';

import Header from './pages/common/Header'
import ArtistPage from "./pages/Artist/ArtistPage";

import GoodsForm from './pages/management/goods/GoodsForm';
import CartList from './pages/shop/cart/CartList';
import Buying from './pages/shop/buy/Buying';
import Bought from './pages/shop/buy/Bought';


function App() {
    // 유저 하드코딩
    // 세션 유지 이후 변경 예정
    const user='summer'
    const artistuuid='1234'

  return (
      <BrowserRouter>
        <div className='header-wrap'>
          <Header />
          <div className="content">
              <Routes>
                <Route path="/chat/ws" element={<ChatPage user={user}/>} />
                <Route path="/chat/subscribe" element={<ArtistPage artistuuid={artistuuid}/>} />
                <Route path="/shop/goods" element={<GoodsList/>}/>
                <Route path="/shop/goods/detail" element={<GoodsDetail/>}/>
                <Route path="/shop/cart" element={<CartList/>}/>
                <Route path="/shop/buy/buying" element={<Buying/>}/>
                <Route path="/shop/buy/bought" element={<Bought/>}/>
                <Route path="/management/goods" element={<GoodsForm/>}/>
              </Routes>
          </div>
        </div>
      </BrowserRouter>
  );
}

export default App;