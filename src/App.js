import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import GoodsList from "./goods/GoodsList";
import GoodsDetail from './goods/GoodsDetail';


function App() {

  return (
      <Router>
        <Routes>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/goods" element={<GoodsList/>}/>
          <Route path="/goods/detail" element={<GoodsDetail/>}/>
        </Routes>
      </Router>
  );
}

export default App;