import { useEffect, useState } from 'react';
import axios from 'axios';

const TeamProfile = ({teamuuid}) => {
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/board/team/${teamuuid}`); // API 엔드포인트에 맞게 수정하세요
                setGroup(response.data);
                console.log(response.data);
            } catch (err) {
                setError('데이터를 가져오는 데 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchGroupData();
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {group && (
            <>
                <div className="team-name">
                    <h2>TEAM name</h2>
                </div>
                <div className="member-wrap">
                    {group.map((member, index) => (
                        <div className="member-info">
                            <div className="member-photo">
                                member photo
                            </div>
                            <div className="member-name">
                                {member.name}
                            </div>
                        </div>
                    ))}
                </div>
            </>
            )}
        </div>
    );
};
export default TeamProfile;