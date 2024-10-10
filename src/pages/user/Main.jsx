import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function UserMain() {
    const location = useLocation();

    useEffect(() => {
        // URL에서 쿼리 파라미터를 추출
        const params = new URLSearchParams(location.search);
        const token = params.get('token'); // 소셜 로그인 시 URL에 포함된 토큰
        if (token) {
            // token이 존재하면 localStorage에 저장
            localStorage.setItem('accessToken', token);
            console.log('Access Token 저장 완료:', token);
        }
    }, [location]);

    return (
        <div>
            <h1>유저 메인 페이지</h1>
            <p>Welcome to User Main Page!</p>
        </div>
    );
}

export default UserMain;
