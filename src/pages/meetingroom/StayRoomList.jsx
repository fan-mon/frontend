import React, { useState } from 'react';
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts/bootstrap-icons.min.css';
import "./css/stayroom.css";

const StayRoomList = () => {

    // 상태값 설정
    const [roomOfMeChecked, setRoomOfMeChecked] = useState(false);
    const [viewEndRoomChecked, setViewEndRoomChecked] = useState(true);

  
    return (
        <>
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <div className="stayroom-list-wrap">
                <div className="contents-box my-meeting-recent">
                  <a href="#" class="my-meeting-content">
                    <div className="img-area">
                      <span className="img-wrap">
                        <img src={`${process.env.PUBLIC_URL}/shop/goods/jung_haein_pillow.png`} alt=""/>
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
                </div>
                <div className="contents-box room-list-box">
                  <div className="">
                    <div className="control-area">
                      <div className="toggles-area">
                          <div class="form-check form-toggle me-4">
                            <input class="form-check-input" type="checkbox" value="" id="roomOfMe" checked={roomOfMeChecked} onChange={(e) => setRoomOfMeChecked(e.target.checked)}/>
                            <label class="form-check-label" for="roomOfMe">입장 가능한 방만 보기</label>
                          </div>
                          <div class="form-check form-toggle">
                            <input class="form-check-input" type="checkbox" value="" id="viewEndRoom" checked={viewEndRoomChecked} onChange={(e) => setViewEndRoomChecked(e.target.checked)}/>
                            <label class="form-check-label" for="viewEndRoom">종료된 방도 보기</label>
                          </div>
                      </div>
                      <div className="search-area">
                        <div className="form-group line-input-group with-btn">
                          <div className='input-wrap'>
                            <input type="text" className="form-control" placeholder='팀 검색'/>
                            <button className="btn btn-ico btn-search">
                              <i class="bi bi-search"></i>
                            </button>
                          </div>
                        </div>
                        <button className="btn btn-default btn-create-room">+ 대기방생성</button>
                      </div>
                    </div>

                    <div className="list-wrap">
                    <div className="row">
                          <div className="col-12 col-sm-6 col-md-4 col-lg-3 room-item-wrap">
                            <a href="#" className="room-item">
                              <div className="room-img-wrap">
                                <img src={`${process.env.PUBLIC_URL}/meetingroom/haein01.jpg`} alt=""/>
                              </div>
                              <div className="label-wrap">
                                <span className="label-room-status label-room-progress">진행중</span>
                              </div>
                              <p className="room-name">데이식스-성진, YoungK, 원필, 도운</p>
                            </a>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-3 room-item-wrap">
                            <a href="#" className="room-item">
                              <div className="room-img-wrap">
                                <img src={`${process.env.PUBLIC_URL}/meetingroom/haein01.jpg`} alt=""/>
                              </div>
                              <div className="label-wrap">
                                <span className="label-room-status label-room-waiting">대기중</span>
                              </div>
                              <p className="room-name">데이식스-성진, YoungK, 원필, 도운</p>
                            </a>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-3 room-item-wrap">
                            <a href="#" className="room-item">
                              <div className="room-img-wrap">
                                <img src={`${process.env.PUBLIC_URL}/meetingroom/haein01.jpg`} alt=""/>
                              </div>
                              <div className="label-wrap">
                                <span className="label-room-status label-room-ended">종료</span>
                              </div>
                              <p className="room-name">정해인</p>
                            </a>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-3 room-item-wrap">
                            <a href="#" className="room-item">
                              <div className="room-img-wrap">
                                <img src={`${process.env.PUBLIC_URL}/meetingroom/haein01.jpg`} alt=""/>
                              </div>
                              <div className="label-wrap">
                                <span className="label-room-status label-room-interrupt">중단</span>
                              </div>
                              <p className="room-name">데이식스-성진, YoungK, 원필, 도운</p>
                            </a>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-3 room-item-wrap">
                            <a href="#" className="room-item">
                              <div className="room-img-wrap">
                                <img src={`${process.env.PUBLIC_URL}/meetingroom/haein01.jpg`} alt=""/>
                              </div>
                              <div className="label-wrap">
                                <span className="label-room-status label-room-ended">종료</span>
                              </div>
                              <p className="room-name">데이식스-성진, YoungK, 원필, 도운 데이식스와 함께하는 겨울 맞이 대 팬미팅</p>
                            </a>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-3 room-item-wrap">
                            <a href="#" className="room-item">
                              <div className="room-img-wrap">
                                <img src={`${process.env.PUBLIC_URL}/meetingroom/haein01.jpg`} alt=""/>
                              </div>
                              <div className="label-wrap">
                                <span className="label-room-status label-room-stop">일시정지</span>
                              </div>
                              <p className="room-name">데이식스-성진, YoungK, 원필, 도운</p>
                            </a>
                          </div>
                          
                        </div>
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

export default StayRoomList;