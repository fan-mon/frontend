import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../apiClient';


import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts/bootstrap-icons.min.css';
import './css/stayroom.css';

const CreateRoom = () => {
  // 상태값 설정
  const [roomImage, setRoomImage] = useState(null);
  const [teamName, setTeamName] = useState('');  // 팀 이름 상태
  const [teamUUID, setTeamUUID] = useState('');  // 팀 uuid 상태
  const [searchTerm, setSearchTerm] = useState('');  // 검색어 상태
  const [meetingRoomName, setMeetingRoomName] = useState('');
  const [meetingCapacity, setMeetingCapacity] = useState(0);
  const [meetingTimePerPerson, setMeetingTimePerPerson] = useState(0);
  const [breakTimeBetween, setBreakTimeBetween] = useState(0);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingStartTime, setMeetingStartTime] = useState('');
  const [maxPeopleNum, setMaxPeopleNum] = useState(0); //maxPeopleNum
  const [management, setManagement] = useState(''); //매니지먼트를 저장할 상태 변수 
  const [teams, setTeams] = useState([]); // 팀 목록을 저장할 상태 변수
  const [isPublic, setIsPublic] = useState(false);
  const [userName, setUserName] = useState('비로그인');
  const [userUUID, setUserUUID] = useState('');

  
  // 체크박스 상태 변경 함수
  const handleIsPublicChange = (e) => {
    setIsPublic(!e.target.checked); // 체크박스가 체크된 경우 false, 체크 해제된 경우 true로 설정
  };

  const getBack = async (url, func)=>{
    try{
      const response = await api.get(url);
      func(response);
    }catch(error){
      console.log("Back 단과 통신 오류 : ", error);
    }
  }
  // 사용자 정보 불러오기
  const fetchUserInfo = async() =>{
    try{
      const response = await api.get('/management/myprofile');
      //console.log(response.data);
      setUserName(response.data.name);
      setUserUUID(response.data.managementuuid);
      setManagement(userName);
    }catch(error){
      console.error("사용자 정보 가져오기 오류: ", error);
    }
  }

  fetchUserInfo();
  getBack(`/meetingroom/teamlist?managerUUID=${userUUID}`, (res)=>{
    setTeams(res.data);
  });
  useEffect(() => {
    
  }, [teams]);

  useEffect(()=>{
    // 팀 목록 불러오기
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // ISO 형식에서 날짜 부분만 추출
    setMeetingDate(formattedDate); // 상태에 설정
    today.setHours(today.getHours() + 1); // 현재 시간에 1시간 추가
    const formattedTime = today.toTimeString().split(' ')[0].slice(0, 5); // HH:MM 형식으로 변환
    setMeetingStartTime(formattedTime); // 상태에 설정
  }, []);
 
  

  // 팀 선택 시 호출되는 함수
  const handleTeamSelect = (team) => {
    setTeamName(team.name);
    setTeamUUID(team.teamuuid);
    setManagement(userName); 

    getBack(`/meetingroom/maxPeopleNum?teamName=${team.name}`, (res)=>{
      setMaxPeopleNum(res.data);
    });
  };

  // 팀 목록 검색 처리
  const filteredTeams = Array.isArray(teams) ? teams.filter(team => team.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];

  // 방 생성 데이터 전송
  const handleSendNewRoom = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("roomImage", roomImage);
    
    const stayroomData = {
      name: meetingRoomName,
      createdat: new Date(),
      meetingDate: meetingDate,
      meetingStartTime: meetingStartTime,
      teamUUID: teamUUID,
      peopleNum: meetingCapacity,
      meetingTime: meetingTimePerPerson,
      restTime: breakTimeBetween,
      isPublic: isPublic,  // 예시로 설정
      managementuuid: userUUID
    };
    
    formData.append("stayroom", (JSON.stringify(stayroomData)));
    
    axios.post('http://localhost:8080/meetingroom/insert', formData, {
      headers: {
          // 'Content-Type': 'multipart/form-data' // 이 줄은 삭제하세요.
      }})
    .then(response => {
      console.log('성공적으로 보냈습니다:', response.data);
    })
    .catch(error => {
      console.error('데이터 전송 중 에러 발생:', error);
    });

    window.location.href = '/meetingroom/stayroomlist';
  };

  return (
    <div className="createroom">
      <form method='post' encType='multipart/form-data' onSubmit={handleSendNewRoom}>
        <div className="container-fluid">
          <div className="contents-wrap row">
            <div className="col-md-4">
              <div className="contents-box">
                <p className="mb-3">방 대표 이미지</p>
                <div className="prev-img-area mb-4">
                  
                <img
                    src={`${process.env.PUBLIC_URL}/meetingroom/base_thumnail.png`}
                    alt="대표 이미지"
                    id="teamImg"
                  />
                </div>
                <div className="form-group line-input-group">
                  <label htmlFor="roomImage" className="with-file"></label>
                  <div className="input-wrap file">
                    <input
                      className="form-control"
                      type="file"
                      name="roomImage"
                      id="roomImage"
                      onChange={(e) => setRoomImage(e.target.files[0])}
                    />
                  </div>
                </div>
                <p class="mt-2">* 최대 크기 4MB까지 이미지 저장이 가능합니다.</p>
              </div>
            </div>
            <div className="col-md-8">
              <div className="contents-box input-box">
                {/* 팀 이름 입력 */}
                <div className="form-group line-input-group mb-4">
                  <div className="row mb-3">
                    <label htmlFor="teamName" className="col-xl-3 col-lg-3 col-form-label">팀</label>
                    <div className="col-xl-9 col-lg-9">
                      <div className="input-wrap">
                        <div className="dropdown">
                          <input type="hidden" className="form-control" placeholder='팀이름' name="teamuuid" id="teamName" value={teamUUID} required/>
                          <button className="btn dropdown-toggle btn-dropdown" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                            {teamName || '팀 선택'}
                          </button>
                          <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <div className="input-wrap">
                              <label htmlFor="searchTeamName" className="hidden-label">팀 이름 검색</label>
                              <input
                                type="text"
                                id="searchTeamName"
                                className="form-control search-dropdown"
                                placeholder='팀 이름 검색'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                            {filteredTeams.map(team => (
                              <button
                                className="dropdown-item"
                                type="button"
                                key={team.teamuuid}
                                onClick={() => {
                                  handleTeamSelect(team);
                                }}
                              >
                                {team.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 관리자 이름 출력 */}
                <div className="form-group line-input-group mb-4">
                  <div className="row mb-3">
                    <label htmlFor="roomname" className="col-xl-3 col-lg-3 col-form-label">매니지먼트</label>
                    <div className="col-xl-9 col-lg-9">
                      <div className="input-wrap">
                        <input type="text" className="form-control" id="manageName" name="manageName" value={management} onChange={(e) => setManagement(e.target.value)} required readOnly/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 미팅룸 이름 입력 */}
                <div className="form-group line-input-group mb-4">
                  <div className="row mb-3">
                    <label htmlFor="roomname" className="col-xl-3 col-lg-3 col-form-label">미팅룸 이름</label>
                    <div className="col-xl-9 col-lg-9">
                      <div className="input-wrap">
                        <input type="text" className="form-control" id="roomname" name="name" value={meetingRoomName} onChange={(e) => setMeetingRoomName(e.target.value)} required/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 미팅 인원수 입력 */}
                <div className="form-group line-input-group mb-4">
                    <div className="row mb-3">
                      <label htmlFor="roomname" className="col-xl-3 col-lg-3 col-form-label">미팅 인원수</label>
                      <div className="col-xl-9 col-lg-9">
                        <div className="d-flex flex-wrap">
                          <div className="input-wrap me-5">
                            <input type="number" name="peopleNum" className="form-control w-80" id="peopleNum" min="1" max={maxPeopleNum} defaultValue={maxPeopleNum} value={meetingCapacity} onChange={(e) => setMeetingCapacity(Number(e.target.value))}/>
                            <span>명</span>
                          </div>
                          <div className="form-check custom-chk mt-3 mb-3">
                            <input className="form-check-input" type="checkbox" id="isPublic" defaultChecked name="isPublic" onChange={handleIsPublicChange}/>
                            <label className="form-check-label" htmlFor="isPublic">
                              대기방 미팅 입장권이 있는 사람만 참여
                            </label>
                          </div>
                        </div>
                        <p className="mt-2">* 최대 <span>{maxPeopleNum}</span> 명 까지 가능합니다.</p>
                      </div>
                    </div>
                  </div>

                  {/* 인당 미팅시간 입력 */}
                  <div className="form-group line-input-group mb-4">
                    <div className="row mb-3">
                      <label htmlFor="meetingTimePerPerson" className="col-xl-3 col-lg-3 col-form-label">인당 미팅시간</label>
                      <div className="col-xl-9 col-lg-9">
                        <div className="input-wrap">
                          <input type="number" className="form-control w-80" id="meetingTimePerPerson" min="1" max="120" defaultValue="20" name="meetingTimePerPerson" value={meetingTimePerPerson} onChange={(e) => setMeetingTimePerPerson(e.target.value)}/>
                          <span>분</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 사이 쉬는시간 입력 */}
                  <div className="form-group line-input-group mb-4">
                    <div className="row mb-3">
                      <label htmlFor="restTime" className="col-xl-3 col-lg-3 col-form-label">사이 쉬는시간</label>
                      <div className="col-xl-9 col-lg-9 d-flex">
                        <div className="input-wrap me-4">
                          <span>인당</span>
                        </div>
                        <div className="input-wrap">
                          <input type="number" className="form-control w-80" id="restTime" name="restTime" min="0" defaultValue="10" value={breakTimeBetween} onChange={(e) => setBreakTimeBetween(e.target.value)}/>
                          <span>분</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 미팅 시작시간 입력 */}
                  <div className="form-group line-input-group mb-4">
                    <div className="row mb-3">
                      <label htmlFor="meetingstartedat_date" className="col-xl-3 col-lg-3 col-form-label">미팅 시작시간</label>
                      <div className="col-xl-9 col-lg-9 d-flex">
                        <div className="input-group">
                          <div className="input-wrap date me-4 pb-1 pt-1">
                            <input type="date" className="form-control" id="meetingstartedat_date" name="meetingstartedat_date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)}/>
                          </div>
                          <div className="input-wrap time pb-1 pt-1">
                            <label htmlFor="meetingstartedat_time" class="hidden-label"></label>
                            <input type="time" className="form-control" id="meetingstartedat_time" name="meetingstartedat_time"  value={meetingStartTime} onChange={(e) => setMeetingStartTime(e.target.value)}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
          <div className="btns-wrap btns-wrap-r">
            <a href="/meetingroom/stayroomlist" className="btn btn-default" id="insertCancel">취소</a>
            <button type="submit" className="btn btn-primary ms-3" onClick={handleSendNewRoom}>방 생성</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateRoom;