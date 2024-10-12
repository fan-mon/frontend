import ArtistBoard from "./ArtistBoard";
import BoardNotice from './BoardNotice';
import FanBoard from './FanBoard';
import TeamProfile from "./TeamProfile";
import api from "../../apiClient";
import './css/board.css';
import {useEffect, useState} from "react";

const BoardPage = ({ teamuuid }) => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        fetchUserInfo(); // 컴포넌트가 마운트될 때 사용자 정보 가져오기
    }, []);
    const fetchUserInfo = async () => {
        try {
            const response = await api.get('/users/myprofile');
            console.log(response.headers); // 응답 헤더 출력
            console.log(response.data); // 사용자 정보 로그 출력
            setUsername(response.data.name); // 사용자 이름 상태 업데이트
            console.log(`username : ${username}`)
        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
        }
    };

    return (
        <div className="whole-page">
            <div className="team-profile">
                <TeamProfile teamuuid={teamuuid}/>
            </div>
            <div className="page">
                    <div className="left-column">
                        <ArtistBoard
                            teamUuid={teamuuid}/>
                    </div>
                    <div className="right-column">
                        <div className="notice">
                            <BoardNotice
                                teamUuid={teamuuid}/>
                        </div>
                        <hr/>
                        <div className="fan-board">
                            <FanBoard
                                teamUuid={teamuuid}/>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default BoardPage;