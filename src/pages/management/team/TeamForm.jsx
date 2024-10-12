import { useState, useEffect } from "react";
import axios from "axios";
import api from '../../../apiClient';
import "./css/teamform.css";
import { useParams } from "react-router-dom";

const TeamForm = () => {
    const [mgName, setMgName] = useState('로그인 안됨');
    const [managementuuid, setManagementuuid] = useState('');

    const [name, setName] = useState('');
    const [debut, setDebut] = useState('');
    const [description, setDescription] = useState('');
    const [followers, setFollowers] = useState('');
    const [file, setFile] = useState(null);

    const [artists, setArtists] = useState([]); // 아티스트 목록 상태
    const [selectedArtists, setSelectedArtists] = useState([]); // 선택한 아티스트 상태

    const [message, setMessage] = useState('');

    //로그인한 management 정보 가져오기
    const fetchManagementInfo = async () => {
        try {
            const response = await api.get('/management/myprofile');
            console.log(response.headers); // 응답 헤더 출력
            console.log(response.data); // 사용자 정보 로그 출력
            setMgName(response.data.name);
            setManagementuuid(response.data.managementuuid);
            console.log(response.data.managementuuid);

            //managementuuid 설정된 후 fetchArtists 호출
            await fetchArtists(response.data.managementuuid);
        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
        }
    };

    // 아티스트 목록 가져오기
    const fetchArtists = async (uuid) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/artist/list/${uuid}`);
            setArtists(response.data); // 아티스트 목록 설정
        } catch (error) {
            console.error('Error fetching artists: ', error);
        }
    };

    useEffect(() => {
        fetchManagementInfo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('managementuuid', managementuuid);
        formData.append('name', name);
        formData.append('debut', debut);
        formData.append('description', description);
        formData.append('followers', followers);
        if (file) {
            formData.append('uploadfile', file);
        }

        // FormData의 모든 필드를 확인하는 방법
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            // 팀 생성 요청
            const teamResponse = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/management/team`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const teamuuid = teamResponse.data.teamuuid; // 생성된 팀의 UUID

            // 선택한 아티스트와 팀의 UUID를 함께 전송
            const artistTeamPromises = selectedArtists.map(artistuuid => {
                console.log(selectedArtists);
                const relatedData = new FormData();
                relatedData.append('artistuuid', artistuuid);
                relatedData.append('teamuuid', teamuuid);
                return axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/management/artistTeam`, relatedData);
            });

            // 모든 아티스트 팀 관계 저장 요청
            await Promise.all(artistTeamPromises);

            setMessage(`팀이 성공적으로 등록되었습니다: ${teamResponse.data.name}`);
            // Reset the form fields
            setName('');
            setDebut('');
            setDescription('');
            setFollowers('');
            setFile(null);
            setSelectedArtists([]); // 선택한 아티스트 초기화
        } catch (error) {
            setMessage('팀 등록에 실패하였습니다.');
            console.error('Error creating team: ', error);
        }
    };

    return (
        <div className="artist-form-container">
            <h2 id="title">팀 등록</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>데뷔일</label>
                    <input
                        type="date"
                        value={debut}
                        onChange={(e) => setDebut(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>설명</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>팔로워 수</label>
                    <input
                        type="number"
                        value={followers}
                        onChange={(e) => setFollowers(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>파일 업로드</label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>아티스트 선택</label>
                    <div className="artist-checkboxes">
                        {artists.map(artist => (
                            <div key={artist.artistuuid}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={artist.artistuuid}
                                        checked={selectedArtists.includes(artist.artistuuid)}
                                        onChange={(e) => {
                                            const uuid = e.target.value;
                                            setSelectedArtists(prev =>
                                                prev.includes(uuid) ? prev.filter(artistuuid => artistuuid !== uuid) : [...prev, uuid]
                                            );
                                        }}
                                    />
                                    {artist.name}
                                </label>
                            </div>
                        ))}

                    </div>
                    {/* 선택한 아티스트 수 표시 */}
                    <p>선택한 아티스트 수: {selectedArtists.length}</p>
                </div>
                <button type="submit" id="submitBtn">등록</button>
            </form>
            {message && <p className="message">{message}</p>}
            <div>
                <a className="list-anchor" href="/management/teamList">목록으로</a>
            </div>
        </div>
    );
}
export default TeamForm;