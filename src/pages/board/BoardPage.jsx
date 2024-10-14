import ArtistBoard from "./ArtistBoard";
import BoardNotice from './BoardNotice';
import FanBoard from './FanBoard';
import TeamProfile from "./TeamProfile";
import api from "../../apiClient";
import './css/board.css';
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const BoardPage = () => {
    const [username, setUsername] = useState("");
    const {teamuuid} = useParams();

    useEffect(() => {
        fetchUserInfo(); // 컴포넌트가 마운트될 때 사용자 정보 가져오기
    },[]);

    useEffect(() => {
        console.log(`username : ${username}`);
    }, [username]); // username이 업데이트될 때마다 로그 찍기
    const fetchUserInfo = async () => {
        if (sessionStorage.getItem("role")==='USER'){
            try {
                const response = await api.get('/users/myprofile');
                setUsername(response.data.name); // 사용자 이름 상태 업데이트
                localStorage.setItem("uuid", response.data.useruuid)
                console.log(`username : ${username}`)
            } catch (error) {
                console.error("사용자 정보 가져오기 오류:", error);
            }
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