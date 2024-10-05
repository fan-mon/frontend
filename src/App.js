import './App.css';
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from "react-router-dom";
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
import ManagementSignUp from "./pages/management/ManagementSignUp";
import GoodsManage from './pages/management/goods/GoodsManage';
import GoodsMain from './pages/shop/goods/GoodsMain';
import ChatPage from "./pages/chat/ChatPage";
import StayRoom from './pages/meetingroom/StayRoom';
import MeetingRoom from './pages/meetingroom/MeetingRoom';



function App() {
    const useruuid='0cf55a0d-a2a5-443b-af46-835d70874c40'
    const teamuuid='8456584b-809d-11ef-b4db-0a2a78c30fc9'       //데이식스
    const artistuuid = 'ca5a5a75-809c-11ef-b4db-0a2a78c30fc9'   //영케이
    const chatuuid = '8bb74c71-809e-11ef-b4db-0a2a78c30fc9'
    
  return (
      <BrowserRouter>
        <div className='header-wrap'>
          <Header />
          <div className="content">
              <Routes>
                <Route path="/chat/ws" element={<ChatPage artistUuid={artistuuid} userUuid={useruuid} chatUuid={chatuuid}/>} />
                <Route path="/chat/subscribe" element={<ArtistPage artistuuid={teamuuid}/>} />
                <Route path="/shop/goods/list/:teamuuid/all" element={<GoodsList/>}/>
                <Route path="/shop/goods/list/:teamuuid/:category" element={<GoodsList/>}/>
                <Route path="/board" element={<BoardPage teamuuid={teamuuid}/>}/>
                <Route path="/shop/goods/detail/:goodsuuid" element={<GoodsDetail/>}/>
                <Route path="/shop/cart" element={<CartList/>}/>
                <Route path="/shop/buy/buying" element={<Buying/>}/>
                <Route path="/shop/buy/bought" element={<Bought/>}/>
                <Route path="/management/goodsform" element={<GoodsForm/>}/>
                <Route path="/management/goodsmanage" element={<GoodsManage/>}/>
                <Route path="/user/signup" element={<SignUp/>}/>
                <Route path="/shop/goods/main" element={<GoodsMain/>}/>
                <Route path="/management/managementsignup" element={<ManagementSignUp/>}/>
                <Route path="/meetingroom/stayroom" element={<StayRoom/>}/>
                <Route path="/meetingroom/meetingroom" element={<MeetingRoom/>}/>
              </Routes>
          </div>
        </div>
      </BrowserRouter>
  );
}

export default App;