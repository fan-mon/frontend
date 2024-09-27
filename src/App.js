import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import GoodsList from './pages/shop/goods/GoodsList';
import GoodsDetail from './pages/shop/goods/GoodsDetail';


function App() {

  return (
      <Router>
        <Routes>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/shop/goods" element={<GoodsList/>}/>
          <Route path="/shop/goods/detail" element={<GoodsDetail/>}/>
        </Routes>
      </Router>
  );
}

export default App;