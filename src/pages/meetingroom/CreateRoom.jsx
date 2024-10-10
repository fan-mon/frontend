import React, { useState } from 'react';
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts/bootstrap-icons.min.css';
import "./css/stayroom.css";

const CreateRoom = () => {

    // 상태값 설정
    const [roomOfMeChecked, setRoomOfMeChecked] = useState(false);
    const [viewEndRoomChecked, setViewEndRoomChecked] = useState(true);

  
    return (
        <>
        <div className="createroom">
        <form>
          <div className="container-fluid">
            <div className="contents-wrap row">
              <div className="col-md-4"> 
                <div className="contents-box">
                  <p className='mb-3'>방 대표 이미지</p>
                  <div className="prev-img-area mb-4">
                    <img src={`${process.env.PUBLIC_URL}/meetingroom/haein01.jpg`} alt=""/>
                  </div>
                  <div className="form-group line-input-group">
                      <label for="inTeamImg" class="with-file"></label>
                      <div className="input-wrap file">
                        <input class="form-control" type="file" name="inTeamImg" id="inTeamImg" />
                      </div>
                    </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="contents-box input-box">
                  <div className="form-group line-input-group mb-4">
                    <div class="row mb-3">
                      <label for="roomname" class="col-xl-3 col-lg-3 col-form-label">팀</label>
                      <div class="col-xl-9 col-lg-9">
                        <div className="btns-wrap">
                          <div className="input-wrap in-team-name">
                            <input type="text" class="form-control" id="roomname" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group line-input-group mb-4">
                    <div class="row mb-3">
                      <label for="roomname" class="col-xl-3 col-lg-3 col-form-label">미팅룸 이름</label>
                      <div class="col-xl-9 col-lg-9">
                        <div className="input-wrap">
                          <input type="text" class="form-control" id="roomname" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group line-input-group mb-4">
                    <div class="row mb-3">
                      <label for="roomname" class="col-xl-3 col-lg-3 col-form-label">미팅 인원수</label>
                      <div class="col-xl-9 col-lg-9">
                        <div className="d-flex flex-wrap">
                          <div className="input-wrap me-5">
                            <input type="number" class="form-control w-80" id="roomname" min="1" max="1000" value="20"/>
                            <span>명</span>
                          </div>
                          <div class="form-check custom-chk mt-3 mb-3">
                              <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked/>
                              <label class="form-check-label" for="flexCheckChecked">
                                대기방 미팅 입장권이 있는 사람만 참여
                              </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group line-input-group mb-4">
                    <div class="row mb-3">
                      <label for="roomname" class="col-xl-3 col-lg-3 col-form-label">관리자</label>
                      <div class="col-xl-9 col-lg-9">
                        <div className="btns-wrap">
                          <div className="input-wrap in-team-name">
                            <input type="text" class="form-control" id="roomname" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group line-input-group mb-4">
                    <div class="row mb-3">
                      <label for="roomname" class="col-xl-3 col-lg-3 col-form-label">인당 미팅시간</label>
                      <div class="col-xl-9 col-lg-9">
                        <div className="input-wrap">
                          <input type="number" class="form-control w-80" id="roomname" min="1" max="1000" value="20"/>
                          <span>명</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group line-input-group mb-4">
                    <div class="row mb-3">
                      <label for="roomname" class="col-xl-3 col-lg-3 col-form-label">사이 쉬는시간</label>
                      <div class="col-xl-9 col-lg-9 d-flex">
                        <div className="input-wrap me-4">
                          <input type="number" class="form-control w-80" id="roomname" min="1" max="1000" value="20"/>
                          <span>인당</span>
                        </div>
                        <div className="input-wrap">
                          <input type="number" class="form-control w-80" id="roomname" min="1" value="20"/>
                          <span>분</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group line-input-group mb-4">
                    <div class="row mb-3">
                      <label for="roomname" class="col-xl-3 col-lg-3 col-form-label">미팅 시작시간</label>
                      <div class="col-xl-9 col-lg-9 d-flex">
                        <div className="input-group">
                          <div className="input-wrap date me-4 pb-1 pt-1">
                            <input type="date" class="form-control" id="roomname"/>
                          </div>
                          <div className="input-wrap time pb-1 pt-1">
                            <input type="time" class="form-control" id="roomname"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="btns-wrap btns-wrap-r">
              <button className="btn btn-default">취소</button>
              <button className="btn btn-primary ms-3">방 생성</button>
            </div>
          </div>
        </form>
        </div>
        </>
    );
};

export default CreateRoom;