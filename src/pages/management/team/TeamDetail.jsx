import React, { useEffect, useState } from 'react';
import "./css/teamdetail.css";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function TeamDetail() {
    const managementuuid = '32eb55e2-022c-4741-8a41-d32916480b4e'; //hard coding
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

    // Team detail 정보 가져오기 API 호출
    const fetchTeamDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/management/team/${teamuuid}`);
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
            const response = await axios.get(`http://localhost:8080/management/artistTeam/${teamuuid}`);
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
            const response = await axios.get(`http://localhost:8080/management/artist/list/${managementuuid}`);
            setAllArtists(response.data);
        } catch (err) {
            setError('Error fetching all artists: ' + err.message);
        }
    };

    useEffect(() => {
        fetchTeamDetail();
        fetchTeamArtists();
    }, [teamuuid]);

    // 팀 삭제
    const handleDeleteClick = async () => {
        const confirmed = window.confirm('정말로 팀을 삭제하시겠습니까?');
        if (confirmed) {
            try {
                //아티스트-팀 관계 삭제
                await axios.delete(`http://localhost:8080/management/artistTeam/${teamuuid}`);
                //팀 삭제
                await axios.delete(`http://localhost:8080/management/team/${teamuuid}`);
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
            await axios.put(`http://localhost:8080/management/team/${teamuuid}`, formData);

            //기존 소속 아티스트 삭제(DELETE)
            await axios.delete(`http://localhost:8080/management/artistTeam/${teamuuid}`);

            // 소속 아티스트 업데이트
            const artistTeamPromises = selectedArtists.map(artistuuid => {
                console.log(artistuuid);
                console.log(teamuuid);
                const relatedData = new FormData();
                relatedData.append('artistuuid', artistuuid);
                relatedData.append('teamuuid', teamuuid);
                return axios.post('http://localhost:8080/management/artistTeam', relatedData);
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
        <div className="team-detail-container">
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
            <p>팔로워 수: {isEditing ? (
                <input type="number" value={followers} onChange={(e) => setFollowers(e.target.value)} />
            ) : (
                followers
            )}</p>

            {/* 이미지 표시 */}
            {!isEditing && fname && (
                <img className='team-img' src={`http://localhost:8080/resources/teamimg/${fname}`} alt={`${name} 이미지`} />
            )}

            {isEditing && (
                <div>
                    <label>이미지 파일:</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
            )}

            <h3>소속 아티스트</h3>
            {isEditing ? (
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
            ) : (
                <ul>
                    {artists.map(arts => (
                        <li key={arts.artistteamuuid}>{arts.artist.name}</li>
                    ))}
                </ul>
            )}

            {isEditing ? (
                <button onClick={handleUpdateClick}>수정 완료</button>
            ) : (
                <button onClick={() => { setIsEditing(true); fetchAllArtists(); }}>수정하기</button>
            )}
            <button onClick={handleDeleteClick}>삭제하기</button>
            <button onClick={() => navigate('/management/teamList')}>목록으로</button>
        </div>
    );
}

export default TeamDetail;
