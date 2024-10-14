import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../../apiClient';
import { useParams, useNavigate } from 'react-router-dom';
import "./css/teamdetail.css";

function TeamDetail() {
    const [mgName, setMgName] = useState('로그인 안됨');
    const [managementuuid, setManagementuuid] = useState('');
    const { teamuuid } = useParams();

    const [name, setName] = useState('');
    const [debut, setDebut] = useState('');
    const [fname, setFname] = useState('');
    const [description, setDescription] = useState('');
    const [followers, setFollowers] = useState('');
    const [uploadfile, setUploadfile] = useState(null);
    const [artists, setArtists] = useState([]); // 소속 아티스트 목록
    const [allArtists, setAllArtists] = useState([]); // 모든 아티스트 목록 (편집 모드에서 사용)
    const [selectedArtists, setSelectedArtists] = useState([]); // 선택된 아티스트 (편집 모드에서 사용)

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    //로그인한 management 정보 가져오기
    const fetchManagementInfo = async () => {
        try {
            const response = await api.get('/management/myprofile');
            console.log(response.headers); // 응답 헤더 출력
            console.log(response.data); // 사용자 정보 로그 출력
            setMgName(response.data.name);
            setManagementuuid(response.data.managementuuid);
            console.log(response.data.managementuuid);

        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
        }
    };

    // Team detail 정보 가져오기 API 호출
    const fetchTeamDetail = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/team/${teamuuid}`);
            const team = response.data;
            setName(team.name);
            setDebut(team.debut);
            setFname(team.fname);
            setDescription(team.description);
            setFollowers(team.followers);
            setLoading(false);
        } catch (err) {
            setError('Error fetching team details: ' + err.message);
        }
    };

    // 소속 아티스트 가져오기 API 호출
    const fetchTeamArtists = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/artistTeam/${teamuuid}`);
            setArtists(response.data); // 소속 아티스트 목록 설정
            setSelectedArtists(response.data.map(artist => artist.artist.artistuuid)); // 편집 모드에서 선택된 아티스트 설정
            // response.data에서 각 아티스트의 artistuuid를 추출하여 새로운 배열을 생성합니다

            // for 디버깅
            response.data.forEach(arts => {
                console.log(arts);
                if (arts.artist) { // artist가 있는지 체크
                    console.log(arts.artist.name); // 각 아티스트의 이름 출력
                } else {
                    console.log('artist 속성이 없습니다:', arts);
                }
            });
        } catch (err) {
            setError('Error fetching team artists: ' + err.message);
        }
    };

    // 모든 아티스트 목록 가져오기 (편집 모드에서 사용)
    const fetchAllArtists = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/artist/list/${managementuuid}`);
            setAllArtists(response.data);
        } catch (err) {
            setError('Error fetching all artists: ' + err.message);
        }
    };

    useEffect(() => {
        fetchManagementInfo();
        fetchTeamDetail();
        fetchTeamArtists();
    }, [teamuuid]);

    // 팀 삭제
    const handleDeleteClick = async () => {
        const confirmed = window.confirm('정말로 팀을 삭제하시겠습니까?');
        if (confirmed) {
            try {
                //아티스트-팀 관계 삭제
                await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/management/artistTeam/${teamuuid}`);
                //팀 삭제
                await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/management/team/${teamuuid}`);
                alert('팀이 삭제되었습니다.');
                navigate('/management/teamList');
            } catch (error) {
                console.error('Error deleting team:', error);
                alert('팀 삭제에 실패하였습니다.');
            }
        }
    };

    // 팀 정보 업데이트
    const handleUpdateClick = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('managementuuid', managementuuid);
        formData.append('teamuuid', teamuuid);
        formData.append('name', name);
        formData.append('debut', debut);
        formData.append('description', description);
        formData.append('followers', followers);
        formData.append('fname', fname);
        if (uploadfile) {
            formData.append('uploadfile', uploadfile);
        }

        try {
            //팀 정보 업데이트(PUT)
            await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/management/team/${teamuuid}`, formData);

            //기존 소속 아티스트 삭제(DELETE)
            await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/management/artistTeam/${teamuuid}`);

            // 소속 아티스트 업데이트
            const artistTeamPromises = selectedArtists.map(artistuuid => {
                console.log(artistuuid);
                console.log(teamuuid);
                const relatedData = new FormData();
                relatedData.append('artistuuid', artistuuid);
                relatedData.append('teamuuid', teamuuid);
                return axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/management/artistTeam`, relatedData);
            });
            await Promise.all(artistTeamPromises);

            alert('팀 정보가 수정되었습니다.');
            setIsEditing(false);
            fetchTeamDetail(); // 최신 팀 정보 불러오기
            fetchTeamArtists(); // 최신 소속 아티스트 불러오기
        } catch (err) {
            console.error('Error updating team:', err);
        }
    };

    const handleFileChange = (e) => {
        setUploadfile(e.target.files[0]);
    };

    const handleArtistChange = (artistuuid) => {
        setSelectedArtists(prev =>
            prev.includes(artistuuid)
                ? prev.filter(uuid => uuid !== artistuuid)
                : [...prev, artistuuid]
        );
    };

    if (loading) {
        return <p>팀 정보를 불러오는 중입니다...</p>;
    }

    return (
        <body className='teamDetail'>
            <div className="team-detail-container">
                <div id="first-column">
                    <div className='detail-team-text'>
                        <h2>팀 상세 정보</h2>

                        <p>이름: {isEditing ? (
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        ) : (
                            name
                        )}</p>
                        <p>데뷔일: {isEditing ? (
                            <input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} />
                        ) : (
                            debut
                        )}</p>
                        <p>설명: {isEditing ? (
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        ) : (
                            description
                        )}</p>
                    </div>

                    <div className='detail-team-img'>
                        {/* 이미지 표시 */}
                        {!isEditing && fname && (
                            <img className='team-img' src={`${process.env.REACT_APP_BACKEND_API_URL}/resources/teamimg/${fname}`} alt={`${name} 이미지`} />
                        )}
                        {isEditing && (
                            <div>
                                <label>이미지 파일:</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                            </div>
                        )}
                    </div>
                </div>
                <div className='detail-artist'>
                    <h3>소속 아티스트</h3>
                    {isEditing ? (
                        <div>
                            <div className="artist-list-edit">
                                {allArtists.map(artist => (
                                    <label key={artist.artistuuid}>
                                        <input
                                            type="checkbox"
                                            value={artist.artistuuid}
                                            checked={selectedArtists.includes(artist.artistuuid)}
                                            onChange={() => handleArtistChange(artist.artistuuid)}
                                        />
                                        {artist.name}
                                    </label>
                                ))}
                            </div>
                            {/* 선택한 아티스트 수 표시 */}
                            <p>선택한 아티스트 수: {selectedArtists.length}</p>
                        </div>
                    ) : (
                        <ul>
                            <table>
                                <tbody>
                                    {artists.map(arts => (
                                        <tr key={arts.artistteamuuid}>
                                            <td><img src={`${process.env.REACT_APP_BACKEND_API_URL}/resources/artistimg/${arts.artist.fname}`}
                                                alt={arts.artist.name} className="artist-img"></img></td>
                                            <td>{arts.artist.name}</td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>

                        </ul>
                    )}
                </div>
                <div className='btns'>
                    {isEditing ? (
                        <button className='btn update-complete-btn' onClick={handleUpdateClick}>수정 완료</button>
                    ) : (
                        <button className='btn update-btn' onClick={() => { setIsEditing(true); fetchAllArtists(); }}>수정하기</button>
                    )}
                    <button className='btn delete-btn' onClick={handleDeleteClick}>삭제하기</button>
                    <button className='btn list-btn' onClick={() => navigate('/management/teamList')}>목록으로</button>
                </div>
            </div>
        </body>
    );
}

export default TeamDetail;
