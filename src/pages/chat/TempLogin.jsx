import {useState} from "react";
import axios from "axios";
const TempLogin = () => {
    const [user, setUser] = useState('');
    const [uuid, setUuid] = useState('');
    const [stat, setStat] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            console.log("uuid : "+uuid);
            const response = await axios.post('http://localhost:8080/chat/login',{
                uuid
            })
            console.log("login response : "+response.data)
            login(response.data.user, response.data.uuid, response.data.stat); // 로그인 함수 호출
        }catch (e) {
            console.log(e);
        }
    };
    // 로그인 함수
    const login = ( uuid ) => {
        localStorage.setItem("uuid",uuid);
        console.log("login success")
    };
    // 로그아웃 함수
    const logout = () => {
        // 로컬 스토리지에서 토큰 삭제
        localStorage.removeItem("user");
        localStorage.removeItem("uuid");
        // 상태 업데이트 등 추가 작업 수행
    };

    return (
        <div>
            <input
                type="text"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
                placeholder="uuid"
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default TempLogin;