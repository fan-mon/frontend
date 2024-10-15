import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import './css/login.css'
const TempLogin = () => {
    const [uuid, setUuid] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            console.log("uuid : "+uuid);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/chat/login`, {     
                uuid
            })
            console.log("login response : "+response.data)
            login(response.data.user, response.data.uuid, response.data.stat); // 로그인 함수 호출
        }catch (e) {
            console.log(e);
        }
    };
    // 로그인 함수
    const login = ( user, uuid, stat ) => {
        localStorage.setItem("uuid",uuid);
        localStorage.setItem("role",'ARTIST')
        console.log("login success")
    };
    // 로그아웃 함수
    const logout = () => {
        // 로컬 스토리지에서 토큰 삭제
        localStorage.removeItem("user");
        localStorage.removeItem("uuid");
        // 상태 업데이트 등 추가 작업 수행
    };

    const navigate = useNavigate();
    const goMain = () => {
        navigate(`/artist/main`)
    };

    return (
        <body>
        <div className="login-wrap">
            <div className='input-top'>아티스트 코드 입력
                <input
                    className='code-input'
                    type="text"
                    value={uuid}
                    onChange={(e) => setUuid(e.target.value)}
                    placeholder="artist code"
                />
            </div>

            <div className="input-bottom">
                <button className='code-button'
                        onClick={()=> {
                            handleLogin()
                            goMain()
                        }}>CHECK</button>
            </div>
        </div>
        </body>

    );
};

export default TempLogin;