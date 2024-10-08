import './App.css';
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from "react-router-dom";
import GoodsList from './pages/shop/goods/GoodsList';
import GoodsDetail from './pages/shop/goods/GoodsDetail';

import Header from './pages/common/Header'
import ArtistPage from "./pages/Artist/ArtistPage";

import CartList from './pages/shop/cart/CartList';
import Buying from "./pages/shop/buy/Buying";
import BoardPage from "./pages/board/BoardPage";
import Bought from "./pages/shop/buy/Bought";
import SignUp from "./pages/user/SignUp";
import ManagementSignUp from "./pages/management/ManagementSignUp";
import Login from "./pages/user/Login";
import GoodsMain from './pages/shop/goods/GoodsMain';
import ChatPage from "./pages/chat/ChatPage";
import StayRoom from './pages/meetingroom/StayRoom';
import MeetingRoom from './pages/meetingroom/MeetingRoom';
import TempLogin from "./pages/chat/TempLogin";
//Management
import TeamList from './pages/management/team/TeamList';
import ManageGoodsList from './pages/management/goods/ManageGoodsList';
import GoodsManage from './pages/management/goods/GoodsManage';
import GoodsForm from './pages/management/goods/GoodsForm';
import ManageGoodsDetail from './pages/management/goods/ManageGoodsDetail';
import GoodsUpdate from './pages/management/goods/GoodsUpdate';
import ArtistList from './pages/management/artist/ArtistList';
import ArtistForm from './pages/management/artist/ArtistForm';
import ArtistDetail from './pages/management/artist/ArtistDetail';
import TeamForm from './pages/management/team/TeamForm';
import TeamDetail from './pages/management/team/TeamDetail';

function App() {
    const useruuid='0cf55a0d-a2a5-443b-af46-835d70874c40'
    const teamuuid='8456584b-809d-11ef-b4db-0a2a78c30fc9'       //데이식스
    const artistUuid = 'ca5a5a75-809c-11ef-b4db-0a2a78c30fc9'   //영케이
    const chatuuid = '8bb74c71-809e-11ef-b4db-0a2a78c30fc9'
    
  return (
      <BrowserRouter>
        <div className='header-wrap'>
          <Header />
          <div className="content">
              <Routes>
                <Route path="/chat/ws/:artistUuid" element={<ChatPage chatUuid={chatuuid}/>} />
                <Route path="/chat/login" element={<TempLogin/>} />
                <Route path="/chat/subscribe" element={<ArtistPage artistuuid={teamuuid}/>} />
                <Route path="/shop/goods/list/:teamuuid/all/:useruuid" element={<GoodsList/>}/>
                <Route path="/shop/goods/list/:teamuuid/:category/:useruuid" element={<GoodsList/>}/>
                <Route path="/board" element={<BoardPage teamuuid={teamuuid}/>}/>
                <Route path="/shop/goods/detail/:goodsuuid/:useruuid" element={<GoodsDetail/>}/>
                <Route path="/shop/cart/list/:useruuid" element={<CartList/>}/>
                <Route path="/shop/buy/buying/:useruuid" element={<Buying/>}/>
                <Route path="/shop/buy/bought/:useruuid" element={<Bought/>}/>
                <Route path="/management/goodsform/:teamuuid" element={<GoodsForm />} />
                <Route path="/management/goodsmanage" element={<GoodsManage/>}/>
                <Route path="/management/manageGoodsList/:teamuuid" element={<ManageGoodsList />} /> {/* 더보기 경로 추가 */}
                <Route path="/management/teamList" element={<TeamList/>} />
                <Route path="/management/artistList" element={<ArtistList/>} />
                <Route path='/management/artistForm/:managementuuid' element={<ArtistForm/>}/>
                <Route path='/management/artistDetail/:artistuuid' element={<ArtistDetail/>}/>
                <Route path="/management/manageGoodsDetail/:goodsuuid" element={<ManageGoodsDetail />}/>
                <Route path="/management/goodsUpdate/:goodsuuid" element={<GoodsUpdate/>}/>
                <Route path="/management/teamForm/:managementuuid" element={<TeamForm/>}/>
                <Route path='/management/teamDetail/:teamuuid' element={<TeamDetail/>}/>
                <Route path="/user/signup" element={<SignUp/>}/>
                <Route path="/shop/goods/main" element={<GoodsMain/>}/>
                <Route path="/management/managementsignup" element={<ManagementSignUp/>}/>
                <Route path="/user/login" element={<Login/>}/>
                <Route path="/meetingroom/stayroom" element={<StayRoom/>}/>
                <Route path="/meetingroom/meetingroom" element={<MeetingRoom/>}/>
              </Routes>
          </div>
        </div>
      </BrowserRouter>
  );
}

export default App;