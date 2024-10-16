import './App.css';
import { BrowserRouter as Router, Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';

import GoodsList from './pages/shop/goods/GoodsList';
import GoodsDetail from './pages/shop/goods/GoodsDetail';

import Header from './pages/common/Header'
import ManagementHeader from './pages/common/ManagementHeader';
import ArtistHeader from './pages/common/ArtistHeader';

import CartList from './pages/shop/cart/CartList';
import Buying from "./pages/shop/buy/Buying";
import BoardPage from "./pages/board/BoardPage";
import Bought from "./pages/shop/buy/Bought";
import SignUp from "./pages/user/SignUp";
import ManagementSignUp from "./pages/management/ManagementSignUp";
import Login from "./pages/user/Login";

import MyPage from "./pages/user/MyPage";
import GoodsManage from './pages/management/goods/GoodsManage';

import GoodsMain from './pages/shop/goods/GoodsMain';
import ChatPage from "./pages/chat/ChatPage";
import StayRoomList from './pages/meetingroom/StayRoomList';
import StayRoom from './pages/meetingroom/StayRoom';
import MeetingRoom from './pages/meetingroom/MeetingRoom';
import CreateRoom from './pages/meetingroom/CreateRoom';
import TempLogin from "./pages/chat/TempLogin";
import TeamList from './pages/management/team/TeamList';
import ManageGoodsList from './pages/management/goods/ManageGoodsList';
import ManagementMyPage from './pages/management/ManagementMyPage';

import Main from './pages/user/Main';
import DashBoard from './pages/management/DashBoard';

import GoodsForm from './pages/management/goods/GoodsForm';
import ManageGoodsDetail from './pages/management/goods/ManageGoodsDetail';
import GoodsUpdate from './pages/management/goods/GoodsUpdate';
import ArtistList from './pages/management/artist/ArtistList';
import ArtistForm from './pages/management/artist/ArtistForm';
import ArtistDetail from './pages/management/artist/ArtistDetail';
import ArtistLogin from './pages/management/artist/ArtistLogin';
import TeamForm from './pages/management/team/TeamForm';
import TeamDetail from './pages/management/team/TeamDetail';
import MyProfile from './pages/user/MyProfile';
import UpdateProfile from './pages/user/UpdateProfile';
import ManagementMyProfile from './pages/management/ManagementMyProfile';
import UpdateManagement from './pages/management/UpdateManagement';



function App() {

  const useruuid = '0cf55a0d-a2a5-443b-af46-835d70874c40'
  const teamuuid = '8456584b-809d-11ef-b4db-0a2a78c30fc9'       //데이식스
  const artistUuid = 'ca5a5a75-809c-11ef-b4db-0a2a78c30fc9'   //영케이
  const chatuuid = '8bb74c71-809e-11ef-b4db-0a2a78c30fc9'

  return (
    <Router>
      <Content useruuid={useruuid} teamuuid={teamuuid} artistUuid={artistUuid} chatuuid={chatuuid} />
    </Router>

  );
}

const Content = ({useruuid, teamuuid, artistUuid, chatuuid}) => {
  const location = useLocation();
  const [role, setRole] = useState(null);

  // 역할을 로컬 스토리지에서 가져옴
  useEffect(() => {
    const storedRole = localStorage.getItem('role'); // 역할을 로컬 스토리지에서 가져옴
    if (storedRole) {
      setRole(storedRole); // 상태에 역할 저장
      console.log("Stored Role:", storedRole); // 역할 출력
    }
  }, []);

  // 역할에 따라 헤더 선택
  const renderHeader = () => {
    if (role === 'MANAGEMENT') {
      return <ManagementHeader/>;
    } else if (role === 'ARTIST') {
      return <ArtistHeader/>; // 아티스트용 헤더 추가
    }
    return <Header/>; // 기본 헤더
  };

  return (
    <div className='header-wrap'>
      {renderHeader()}
      <div className="content">
        <Routes>
          <Route path="/chat/ws/:chatuuid" element={<ChatPage />} />
          <Route path="/chat/login" element={<TempLogin />} />
          <Route path="/shop/goods/list/:teamuuid/all" element={<GoodsList />} />
          <Route path="/shop/goods/list/:teamuuid/:category" element={<GoodsList />} />
          <Route path="/board/:teamuuid" element={<BoardPage />} />
          <Route path="/shop/goods/detail/:goodsuuid" element={<GoodsDetail />} />
          <Route path="/shop/cart/list" element={<CartList />} />
          <Route path="/shop/buy/buying" element={<Buying />} />
          <Route path="/shop/buy/bought" element={<Bought />} />
          <Route path="/management/goodsform/:teamuuid" element={<GoodsForm />} />
          <Route path="/management/goodsmanage" element={<GoodsManage />} />
          <Route path="/management/manageGoodsList/:teamuuid" element={<ManageGoodsList />} /> {/* 더보기 경로 추가 */}
          <Route path="/management/teamList" element={<TeamList />} />
          <Route path="/management/artistList" element={<ArtistList />} />
          <Route path='/management/artistForm/:managementuuid' element={<ArtistForm />} />
          <Route path='/management/artistDetail/:artistuuid' element={<ArtistDetail />} />
          <Route path='/management/artist/artistlogin' element={<ArtistLogin/>}/>
          <Route path="/management/manageGoodsDetail/:goodsuuid" element={<ManageGoodsDetail />} />
          <Route path="/management/goodsUpdate/:goodsuuid" element={<GoodsUpdate />} />
          <Route path="/management/teamForm/:managementuuid" element={<TeamForm />} />
          <Route path='/management/teamDetail/:teamuuid' element={<TeamDetail />} />
          <Route path="/user/signup" element={<SignUp />} />
          <Route path="/user/mypage" element={<MyPage />} />
          <Route path="/shop/goods/main" element={<GoodsMain />} />
          <Route path="/management/managementsignup" element={<ManagementSignUp />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/meetingroom/stayroomlist" element={<StayRoomList />} />
          <Route path="/meetingroom/stayroom/:stayuuid" element={<StayRoom/>}/>
          <Route path="/meetingroom/meetingroom/:stayuuid" element={<MeetingRoom/>}/>
          <Route path="/meetingroom/createroom" element={<CreateRoom />} />
          <Route path="/user/main" element={<Main />} />
          <Route path="/management/dashboard" element={<DashBoard />} />
          <Route path="/management/managementmypage" element={<ManagementMyPage />} />
          <Route path="/user/myprofile" element={<MyProfile />} />
          <Route path="/user/updateprofile" element={<UpdateProfile />} />
          <Route path="/management/managementmyprofile" element={<ManagementMyProfile />} />
          <Route path="/management/updatemanagement" element={<UpdateManagement />} />
        </Routes>
        </div>
      </div>

  );

}


export default App;