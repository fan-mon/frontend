import React, { useState } from 'react';
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts/bootstrap-icons.min.css';
import "./css/stayroom.css";

const StayRoom = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatPlusOpen, setIsChatPlusOpen] = useState(false);
  
    const openChatRoom = () => setIsChatOpen(true);
    const closeChatRoom = () => setIsChatOpen(false);
    const toggleChatPlus = () => setIsChatPlusOpen(!isChatPlusOpen);
  
    return (
        <>
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
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td><span className="profile-wrap"></span><span>케니스</span></td>
                            <td>05:00</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td><span className="profile-wrap"></span><span>케니스</span></td>
                            <td>05:00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="contents-box current-box">
                  <span className="no">18</span>
                  <span className="name">케니스</span>
                  <div className="my-stay-time">
                    <p className="time">43:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`col-4 chatroom-area ${isChatOpen ? 'open' : ''}`}>
              <div className="contents-box contents-scroll-box chatroom">
                <div className="chat-top">
                  <p className="current-people-num">현재 인원&nbsp;&nbsp;<span className="people-num">254</span>명</p>
                  <button className="btn btn-ico btn-chat-close" onClick={closeChatRoom}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <div className="chat-contents">
                  <div className="date-wrap">2024년 09월 19일</div>
                  <div class="chat-wrap">
                        <div class="profile"></div>
                        <div class="content-wrap">
                            <p class="name">윤동주</p>
                            <div class="same-time">
                                <div class="bubble-wrap">
                                    <div class="bubble">
                                        기대된다.
                                    </div>
                                    <div class="bubble">
                                        근데 이거 최대 몇 초까지 기다려 주는거야?
                                    </div>
                                </div>
                                <div class="bubble-time">12:00</div>
                            </div>
                            <div class="same-time">
                                <div class="bubble-wrap">
                                    <div class="bubble">흠
                                    </div>
                                </div>
                                <div class="bubble-time">12:01</div>
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
                <div class="container-fluid">
                    <div class="row">
                        <div class="col">
                            <button class="btn btn-chat-add">
                                <span class="ico-circle-wrap">
                                    <i class="bi bi-camera-fill"></i>
                                </span>
                                <span class="label">카메라</span>
                            </button>
                        </div>
                        <div class="col">
                            <button class="btn btn-chat-add">
                                <span class="ico-circle-wrap">
                                    <i class="bi bi-file-earmark-fill"></i>
                                </span>
                                <span class="label">파일</span>
                            </button>
                        </div>
                        <div class="col">
                            <button class="btn btn-chat-add">
                                <span class="ico-circle-wrap">
                                    <i class="bi bi-image-fill"></i>
                                </span>
                                <span class="label">사진</span>
                            </button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <button class="btn btn-chat-add">
                                <span class="ico-circle-wrap">
                                    <i class="bi bi-voicemail"></i>
                                </span>
                                <span class="label">음성메세지</span>
                            </button>
                        </div>
                        <div class="col"></div>
                        <div class="col"></div>
                    </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </>
    );
};

export default StayRoom;