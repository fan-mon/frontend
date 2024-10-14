import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import api from '../../apiClient';

import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts/bootstrap-icons.min.css';
import "./css/stayroom.css";

const getBack = async (url, func) => {
  try {
    const response = await api.get(url);
    func(response);
  } catch (error) {
    //console.log("Back 단과 통신 오류 : ", error);
  }
};

const StayRoom = () => {
  const [mngUserName, setMngUserName] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [displayName, setDisplayName] = useState('');
  const [displayNo, setDisplayNo] = useState("");
  const [meetingTime, setMeetingTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [meetingstartedat, setMeetingstartedat] = useState(new Date());
  const [progresstime, setProgresstime] = useState(0);
  const [totaltime, setTotaltime] = useState(0);
  const [meetingendedat, setMeetingendedat] = useState(new Date());

  const fetchUserMngInfo = async () => {
    try {
      const response = await api.get('/management/myprofile');
      setMngUserName(response.data.name);
    } catch (error) {
      //console.error("사용자 정보 가져오기 오류: ", error);
    }
  }

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/users/myprofile');
      setUserName(response.data.name);
      setUserEmail(response.data.email);
    } catch (error) {
      //console.error("사용자 정보 가져오기 오류:", error);
    }
  };

  useEffect(()=> {
    fetchUserMngInfo();
    fetchUserInfo();
  },[]);

  const { stayuuid } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [userlist, setUserlist] = useState([]);
  const [userlistLen, setUserlistLen] = useState(0);

  useEffect(() => {
    getBack(`/meetingroom/stayroom/${stayuuid}`, (res) => {
      setRoomData(res.data);
      setRestTime(res.data.restTime * 60);
      setMeetingTime(res.data.meetingTime * 60);
      setMeetingstartedat(new Date(res.data.meetingstartedat));
    });

  getBack(`/meetingroom/stayroom/userlist/${stayuuid}`, (res) => {
    setUserlist(res.data);
    setUserlistLen(res.data.length);
    setTotaltime((meetingTime + restTime) * res.data.length);
  });
  
  const timer = setInterval(() => {
      setProgresstime(prev => Math.floor((new Date() - meetingstartedat) / 1000));
      setMeetingendedat(new Date(meetingstartedat.getTime() + totaltime * 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [stayuuid, meetingstartedat, totaltime, meetingTime, restTime]);
  
  //timer
  const timeFormat = (time) => {
    if (time <= 0) return "00:00";
    const m = Math.floor(time / 60).toString().padStart(2, '0');
    const s = (time % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const [currentNo, setCurrentNo] = useState(0);
  const [currentMeetingTime, setCurrentMeetingTime] = useState(0);
  const [currentRestTime, setCurrentRestTime] = useState(0);
  const [isMeetingActive, setIsMeetingActive] = useState(true);
  useEffect(()=>{
    setCurrentNo(Math.floor(((new Date().getTime()-meetingstartedat.getTime())/1000)/(meetingTime+restTime)));
  }, [meetingstartedat,meetingTime, restTime, currentNo]);


  const setCurrentTimes = ()=>{
    //계산해야하는 시간 = 흐른 시간 - 전 사람까지 소비한 시간
    const test = Math.floor((new Date().getTime()-meetingstartedat.getTime())/1000) - ((meetingTime+restTime)*(currentNo));
    let mt, rt;
    if(test <= meetingTime){
      mt = meetingTime - test;
      rt = restTime;
    }else{
      mt = 0;
      rt = restTime-(test-meetingTime);
    }
    setCurrentMeetingTime(mt);
    setCurrentRestTime(rt);
  }
  useEffect(() => {
    setCurrentTimes();
  }, [currentNo, meetingTime, restTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimes();
    }, 1000);

    return () => clearInterval(timer);
  }, [isMeetingActive, currentMeetingTime, currentRestTime, meetingTime, restTime]);

  const userToMeet = () => {
    if ((currentNo + 1) === displayNo) {
      window.location.href = "/meetingroom/meetingroom";
    }
  };

  const [displayTimeS, setDisplayTimeS] = useState();

  const setDT = () => {
    let t;
    if (displayNo == "M" || displayNo == "X") {
      //총 남은 시간 = 끝나는 시간(시작시간+모든 유저들이 끝나는 시간) - 현재 시간 
      t = Math.floor((meetingstartedat.getTime()+(totaltime*1000) - new Date().getTime()) / 1000);
    } else {
      if(currentNo < displayNo){
        t = Math.floor(((meetingTime + restTime) * (displayNo - 1)) - (new Date().getTime()-meetingstartedat.getTime())/1000);
      }else{
        t = 0;
      }
    }
    return t;
  }
  
  useEffect(() => {
    if (mngUserName) {
      setDisplayName(mngUserName);
      setDisplayNo('M');
    } else {
      if (userName) {
        setDisplayName(userName);
        setDisplayNo("X");

        userlist.forEach(li => {
          if (li.user.email === userEmail) {
            setDisplayNo(li.no);
          }
        });
      } else {
        setDisplayName("비로그인");
        setDisplayNo("X");
      }
    }
  }, [mngUserName, userName, userlist]);

  useEffect(() => {
    const displayTimerS = setInterval(() => {
      setDisplayTimeS(setDT());
    }, 1000);
    return () => clearInterval(displayTimerS);
  }, [meetingendedat, meetingTime, restTime, displayNo, totaltime]);

  useEffect(() => {
    userToMeet();
  }, [currentNo, displayNo]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatPlusOpen, setIsChatPlusOpen] = useState(false);

  const openChatRoom = () => setIsChatOpen(true);
  const closeChatRoom = () => setIsChatOpen(false);
  const toggleChatPlus = () => setIsChatPlusOpen(!isChatPlusOpen);

    return (
        <>
        {/* <a href="/meetingroom/meetingroom" style={{position:'fixed', bottom: '100px', left: '500px'}}>테스트 링크</a> */}
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <div className="stayroom-wrap">
                <div className="contents-box chat-mini-box" onClick={openChatRoom}>
                  <i className="bi bi-chat-dots"></i>
                  <p className="name">케니스</p>
                  <p className="last-chat"><span>진짜 배고파 죽겠다. 다이어트 도대체 언제 끝나냐? 왤케 살은 안빠지는지 진짜 죽을거같다.</span></p>
                </div>
                <div className="contents-box contents-scroll-box user-list-box">
                  <div className="scroll-area">
                    <div className="title-wrap">
                      <p className="sub-title">온라인 팬미팅 대기방</p>
                      <p className="title">
                        <span className="group-name">데이식스</span>
                        <span className="ml-3 mr-3">-</span>
                        <span className="member-names">성진, YoungK, 원필, 도운</span>
                      </p>
                    </div>
                    <div className="table-wrap">
                      <table className="table user-list-table">
                        <colgroup>
                          <col className="w-80" />
                          <col />
                          <col className="w-80" />
                        </colgroup>
                        <thead>
                          <tr>
                            <th>순번</th>
                            <th>대기명단</th>
                            <th>시간</th>
                            <th>휴식</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userlist.length > 0 ? (
                            userlist.map((user, index) => (
                              <tr key={user.stayuserlistuuid} className={index === currentNo ? "current" : ""}>
                                <td>{user.no}</td>
                                <td>
                                  <span className="profile-wrap"></span>
                                  <span>{user.user.name}</span>
                                </td>
                                <td className='meeting-time'>
                                {(index === currentNo)
                                ? timeFormat(currentMeetingTime)
                                 : (index < currentNo 
                                  ? "00:00" 
                                  : timeFormat(meetingTime))}
                                </td>
                                <td className='rest-time'>
                                {index === currentNo 
                                  ? timeFormat(currentRestTime) 
                                  : (index < currentNo 
                                    ? "00:00" 
                                    : timeFormat(restTime))}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4">대기 중인 사용자가 없습니다.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="contents-box current-box">
                  <span className="no" id="myNo">{displayNo}</span>
                  <span className="name" id="myName">{displayName}</span>
                  <div className="my-stay-time">
                    <p className="time" id="myStayTime">{timeFormat(displayTimeS)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* <div className={`col-4 chatroom-area ${isChatOpen ? 'open' : ''}`}>
              <div className="contents-box contents-scroll-box chatroom">
                <div className="chat-top">
                  <p className="current-people-num">현재 인원&nbsp;&nbsp;<span className="people-num">254</span>명</p>
                  <button className="btn btn-ico btn-chat-close" onClick={closeChatRoom}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <div className="chat-contents">
                  <div className="date-wrap">2024년 09월 19일</div>
                  <div className="chat-wrap">
                        <div className="profile"></div>
                        <div className="content-wrap">
                            <p className="name">윤동주</p>
                            <div className="same-time">
                                <div className="bubble-wrap">
                                    <div className="bubble">
                                        기대된다.
                                    </div>
                                    <div className="bubble">
                                        근데 이거 최대 몇 초까지 기다려 주는거야?
                                    </div>
                                </div>
                                <div className="bubble-time">12:00</div>
                            </div>
                            <div className="same-time">
                                <div className="bubble-wrap">
                                    <div className="bubble">흠
                                    </div>
                                </div>
                                <div className="bubble-time">12:01</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chat-bottom">
                  <div className="input-area">
                    <button className="btn btn-ico btn-chat-plus" onClick={toggleChatPlus}>
                      <i className="bi bi-plus-circle-fill"></i>
                    </button>
                    <div className="form-group in-chat-wrap">
                      <input className="form-control in-chat" type="text" />
                      <button className="btn btn-ico btn-chat-submit"></button>
                    </div>
                  </div>
                </div>
                <div className={`chat-etc-add ${isChatPlusOpen ? 'open' : ''}`}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <button className="btn btn-chat-add">
                                <span className="ico-circle-wrap">
                                    <i className="bi bi-camera-fill"></i>
                                </span>
                                <span className="label">카메라</span>
                            </button>
                        </div>
                        <div className="col">
                            <button className="btn btn-chat-add">
                                <span className="ico-circle-wrap">
                                    <i className="bi bi-file-earmark-fill"></i>
                                </span>
                                <span className="label">파일</span>
                            </button>
                        </div>
                        <div className="col">
                            <button className="btn btn-chat-add">
                                <span className="ico-circle-wrap">
                                    <i className="bi bi-image-fill"></i>
                                </span>
                                <span className="label">사진</span>
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <button className="btn btn-chat-add">
                                <span className="ico-circle-wrap">
                                    <i className="bi bi-voicemail"></i>
                                </span>
                                <span className="label">음성메세지</span>
                            </button>
                        </div>
                        <div className="col"></div>
                        <div className="col"></div>
                    </div>
                </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        </>
    );
};

export default StayRoom;