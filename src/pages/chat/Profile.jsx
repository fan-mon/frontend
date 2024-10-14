import {useNavigate} from "react-router-dom";

const Profile = ({data})=>{
    const navigate = useNavigate();

    const goBoard = () => {
        navigate(`/user/main`); // URL로 이동
    };
    return (
        <div className="profile-wrap">
            <img className="profile" src={data.chat.artist.fname}></img>
            <div className="artistinfo">{data.chat.artist.name}</div>
            <div className="board" onClick={goBoard}>메인으로 돌아가기</div>
        </div>
    );
}

export default Profile;