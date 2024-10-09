import { useState, useEffect } from "react";
import axios from "axios";
import "./css/teamform.css";
import { useParams } from "react-router-dom";

const TeamForm = () => {
    const managementuuid = '32eb55e2-022c-4741-8a41-d32916480b4e'; //hard coding
    // const { managementuuid: urlmanagementuuid} = useParams(); //url에서 managementuuid 가져오기
    // const managementuuid = urlmanagementuuid || sessionStorage.getItem('managementuuid'); //세션 저장소에서 가져오기

    const [name, setName] = useState('');
    const [debut, setDebut] = useState('');
    const [description, setDescription] = useState('');
    const [followers, setFollowers] = useState('');
    const [file, setFile] = useState(null);

    const [artists, setArtists] = useState([]); // 아티스트 목록 상태
    const [selectedArtists, setSelectedArtists] = useState([]); // 선택한 아티스트 상태

    const [message, setMessage] = useState('');

    // 아티스트 목록 가져오기
    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/management/artist/list/${managementuuid}`);
                setArtists(response.data); // 아티스트 목록 설정
            } catch (error) {
                console.error('Error fetching artists: ', error);
            }
        };
        fetchArtists();
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
            const teamResponse = await axios.post('http://localhost:8080/management/team', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const teamuuid = teamResponse.data.teamuuid; // 생성된 팀의 UUID

            // 선택한 아티스트와 팀의 UUID를 함께 전송
            const artistTeamPromises = selectedArtists.map(artistuuid => {
                console.log(selectedArtists);
                return axios.post('http://localhost:8080/management/artistTeam', {
                    artistuuid,
                    teamuuid
                });
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
            <h2>팀 등록</h2>
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
                    <div className="artist-dropdown">
                        <button type="button" className="form-control" onClick={() => {
                            const artistNames = selectedArtists.map(uuid => artists.find(artist => artist.artistuuid === uuid)?.name).filter(Boolean);
                            alert(`선택한 아티스트: ${artistNames.join(', ')}`);
                        }}>
                            {selectedArtists.length === 0 ? "아티스트 선택하기" : `${selectedArtists.length}명 선택됨`}
                        </button>
                        <div className="dropdown-content">
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
                    </div>
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