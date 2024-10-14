import React, { useState, useEffect } from 'react';
import api from '../../apiClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts/bootstrap-icons.min.css';
import "./css/stayroom.css";



const getBack = async (url, func) => {
  try {
    const response = await api.get(url);
    func(response);
  } catch (error) {
    console.log("Back 단과 통신 오류 : ", error);
  }
};

const statusMap = {
  ERROR_QUIT: {
    className: 'label-room-interrupt',
    label: '에러'
  },
  NORMAL_TERMINATION: {
    className: 'label-room-ended',
    label: '종료'
  },
  PAUSE: {
    className: 'label-room-stop',
    label: '일시정지'
  },
  FORCE_QUIT: {
    className: 'label-room-interrupt',
    label: '중단'
  },
  PROGRESSING: {
    className: 'label-room-progress',
    label: '진행중'
  },
  STAY: {
    className: 'label-room-waiting',
    label: '대기중'
  }
};

const StayRoomList = () => {
  const [mngUser, setMngUser] = useState("");
  // 사용자 정보 불러오기
  const fetchUserInfo = async() =>{
    try{
      const response = await api.get('/management/myprofile');
      setMngUser(response.data.name);
    }catch(error){
      console.error("사용자 정보 가져오기 오류: ", error);
    }
  }

  fetchUserInfo();

  // 상태값 설정
  const [roomOfMeChecked, setRoomOfMeChecked] = useState(false);
  const [viewEndRoomChecked, setViewEndRoomChecked] = useState(true);
  const [stayrooms, setStayrooms] = useState([]);

  useEffect(() => {
    getBack(`/meetingroom/stayroom/list`, (res) => {
      console.log(res.data); // 이미지 데이터 확인
      const updatedRooms = res.data.map(s => {
        if (s.roomImage) {
          const url =  `data:image/jpeg;base64,${s.roomImage}`;
          
          return { ...s, imgUrl: url };
        }
        return s;
      });
      setStayrooms(updatedRooms);
    });
  }, []);
  

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="stayroom-list-wrap">
            {/* <div className="contents-box my-meeting-recent">
              <a href="/meetingroom/stayroom" className="my-meeting-content" onChange={(e) => setMngUser(e.target.value)}>
                <div className="img-area">
                  <span className="img-wrap">
                    <img src={`${process.env.PUBLIC_URL}/shop/goods/jung_haein_pillow.png`} alt="정해인의 가을 밤 대화"/>
                  </span>
                </div>
                <div className="content-wrap">
                  <div className="title-wrap">
                    <p className="sub-title">지금 바로 참여 가능한 방</p>
                    <p className="title">
                      <span className="member-names">정해인의 가을 밤 대화</span>
                    </p>
                  </div>
                  <div className="start-time">
                    <span>시작 시간까지</span>
                    <p className="time">43:00</p>
                  </div>
                </div>
              </a>
            </div> */}
            <div className="contents-box room-list-box mt-4">
              <div className="control-area">
                {/* <div className="toggles-area">
                  <div className="form-check form-toggle me-4">
                    <input className="form-check-input" type="checkbox" id="roomOfMe" checked={roomOfMeChecked} onChange={(e) => setRoomOfMeChecked(e.target.checked)} />
                    <label className="form-check-label" htmlFor="roomOfMe">입장 가능한 방만 보기</label>
                  </div>
                  <div className="form-check form-toggle">
                    <input className="form-check-input" type="checkbox" id="viewEndRoom" checked={viewEndRoomChecked} onChange={(e) => setViewEndRoomChecked(e.target.checked)} />
                    <label className="form-check-label" htmlFor="viewEndRoom">종료된 방도 보기</label>
                  </div>
                </div> */}
                <div className="search-area">
                  {/* <div className="form-group line-input-group with-btn">
                    <div className="input-wrap">
                      <input type="text" className="form-control" placeholder='팀 검색'/>
                      <button className="btn btn-ico btn-search">
                        <i className="bi bi-search"></i>
                      </button>
                    </div>
                  </div> */}
                   {/* mngUser가 null이 아닐 때만 버튼을 렌더링 */}
                   {mngUser && (
                    <a href="/meetingroom/createroom" className="btn btn-default btn-create-room">+ 방생성</a>
                  )}
                </div>
              </div>

              <div className="list-wrap">
                <div className="row">
                  {stayrooms.map((stayroom) => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 room-item-wrap" key={stayroom.stayuuid}>
                      <a href={`/meetingroom/stayroom/${stayroom.stayuuid}`} className="room-item">
                        <div className="room-img-wrap">
                          {stayroom.imgUrl ? (
                            <img src={stayroom.imgUrl} alt="Blob 이미지" />
                          ) : (
                            <img
                              src={`${process.env.PUBLIC_URL}/meetingroom/base_thumnail.png`} // 템플릿 리터럴로 문자열 삽입
                              alt="대표 이미지"
                            />
                          )}
                        </div>
                        {/* <div className="label-wrap">
                          <span className={`label-room-status ${statusMap[stayroom.status]?.className || ''}`}>
                            {statusMap[stayroom.status]?.label || stayroom.status}
                          </span>
                        </div> */}
                        <p className="room-name mt-3">{stayroom.name}</p>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StayRoomList;
