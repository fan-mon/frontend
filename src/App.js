import './App.css';
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from "react-router-dom";
import ChatPage from "./pages/chat/ChatPage";
import GoodsList from './pages/shop/goods/GoodsList';
import GoodsDetail from './pages/shop/goods/GoodsDetail';

import Header from './pages/common/Header'
import ArtistPage from "./pages/Artist/ArtistPage";

import GoodsForm from './pages/management/goods/GoodsForm';
import CartList from './pages/shop/cart/CartList';
import Buying from "./pages/shop/buy/Buying";
import BoardPage from "./pages/board/BoardPage";
import Bought from "./pages/shop/buy/Bought";
import SignUp from "./pages/user/SignUp";
import GoodsManage from './pages/management/goods/GoodsManage';

import StayRoom from './pages/meetingroom/StayRoom';
import MeetingRoom from './pages/meetingroom/MeetingRoom';


function App() {
    const useruuid='0cf55a0d-a2a5-443b-af46-835d70874c40'
    const teamuuid='8456584b-809d-11ef-b4db-0a2a78c30fc9'

  return (
      <BrowserRouter>
        <div className='header-wrap'>
          <Header />
          <div className="content">
              <Routes>
                <Route path="/chat/ws" element={<ChatPage user={useruuid}/>} />
                <Route path="/chat/subscribe" element={<ArtistPage artistuuid={teamuuid}/>} />
                <Route path="/shop/goods" element={<GoodsList/>}/>
                <Route path="/board" element={<BoardPage teamuuid={teamuuid}/>}/>
                <Route path="/shop/goods/detail" element={<GoodsDetail/>}/>
                <Route path="/shop/cart" element={<CartList/>}/>
                <Route path="/shop/buy/buying" element={<Buying/>}/>
                <Route path="/shop/buy/bought" element={<Bought/>}/>
                <Route path="/management/goodsform" element={<GoodsForm/>}/>
                <Route path="/management/goodsmanage" element={<GoodsManage/>}/>
                <Route path="/user/signup" element={<SignUp/>}/>
                <Route path="/meetingroom/stayroom" element={<StayRoom/>}/>
                <Route path="/meetingroom/meetingroom" element={<MeetingRoom/>}/>
              </Routes>
          </div>
        </div>
      </BrowserRouter>
  );
}

export default App;