import { useEffect, useState } from 'react';
import axios from 'axios';
import {getList} from "../chat/chatAPI/subscription";
import ProfileModal from "./ProfileModal";

const TeamProfile = ({teamuuid}) => {
    const [group, setGroup] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);


    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/artistTeam/${teamuuid}`);
                // console.log("팀 데이터 "+JSON.stringify(response.data))
                setGroup(response.data);
            } catch (err) {
                setError('데이터를 가져오는 데 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchGroupData();
    }, [teamuuid]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = (member) => {
        console.log("모달 열기:", member);
        setSelectedMember(member);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {group && (
            <>
                <div className="team-name">
                    {group.length > 0 ? group[0].team.name : '팀 이름 없음'}
                </div>
                <div
                    className="member-wrap">
                    {group.map((member, index) => (
                        <div key={index} className="member-info" onClick={()=>openModal(member)} >
                            <img className="member-photo" src={`http://localhost:8080/resources/artistimg/${member.artist.fname}`}/>
                            <div  className="member-name">
                                {member.artist.name}
                            </div>
                        </div>
                    ))}
                </div>
                {selectedMember && ( // selectedMember가 있을 때만 모달을 열도록
                    <ProfileModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        data={selectedMember}
                    />
                )}
            </>
            )}
        </div>
    );
};
export default TeamProfile;