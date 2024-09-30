import './App.css';
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from "react-router-dom";
import ChatPage from "./pages/chat/ChatPage";
import GoodsList from './pages/shop/goods/GoodsList';
import GoodsDetail from './pages/shop/goods/GoodsDetail';
import Header from './pages/common/Header'


function App() {
    // 유저 하드코딩
    // 세션 유지 이후 변경 예정
    const user='summer'

  return (
      <BrowserRouter>
        <Header />
        <div className="content">
            <Routes>
              <Route path="/chat" element={<ChatPage user={user}/>} />
              <Route path="/shop/goods" element={<GoodsList/>}/>
              <Route path="/shop/goods/detail" element={<GoodsDetail/>}/>
            </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;