import { useEffect, useState } from 'react';
import axios from 'axios';

const TeamProfile = () => {
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get('/api/group'); // API 엔드포인트에 맞게 수정하세요
                setGroup(response.data);
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
        <div style={{ width: '100%', height: '500px', overflowY: 'auto', border: '1px solid #ccc' }}>
            {group && (
                <>
                    <h2>{group.groupName}</h2>
                    <h3>멤버 목록:</h3>
                    <ul>
                        {group.members.map((member, index) => (
                            <li key={index}>{member.name}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default TeamProfile;