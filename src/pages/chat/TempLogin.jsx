import {useState} from "react";
const TempLogin = () => {
    const [user, setUser] = useState('');
    const [uuid, setUuid] = useState('');

    const handleLogin = () => {
        login(user, uuid); // 로그인 함수 호출
    };
    // 로그인 함수
    const login = (user, uuid) => {
        localStorage.setItem("user", user);
        localStorage.setItem("uuid",uuid);
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
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Username"
            />
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