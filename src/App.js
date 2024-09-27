import './App.css';
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import GoodsList from './pages/shop/goods/GoodsList';
import GoodsDetail from './pages/shop/goods/GoodsDetail';
import Header from './pages/common/Header'


function App() {

  return (
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/shop/goods" element={<GoodsList/>}/>
          <Route path="/shop/goods/detail" element={<GoodsDetail/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;