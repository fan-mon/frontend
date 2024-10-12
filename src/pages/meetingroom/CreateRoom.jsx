import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts/bootstrap-icons.min.css';
import './css/stayroom.css';

const CreateRoom = () => {
  // 상태값 설정
  const [roomOfMeChecked, setRoomOfMeChecked] = useState(false);
  const [viewEndRoomChecked, setViewEndRoomChecked] = useState(true);

  // 방 생성 취소 확인 이벤트
  const handleCancel = (e) => {
    if (!window.confirm('정말 방 생성을 취소하시겠습니까?')) {
      e.preventDefault();
    }
  };

  // useEffect로 마운트 시 이벤트 핸들러 추가 (리액트 방식으로 변경)
  useEffect(() => {
    const cancelBtn = document.getElementById('insertCancel');
    cancelBtn.addEventListener('click', handleCancel);

    return () => {
      cancelBtn.removeEventListener('click', handleCancel); // 컴포넌트 언마운트 시 이벤트 제거
    };
  }, []);

  return (
    <>
      <div className="createroom">
        <form method='post'>
          <div className="container-fluid">
            <div className="contents-wrap row">
              <div className="col-md-4">
                <div className="contents-box">
                  <p className="mb-3">방 대표 이미지</p>
                  <div className="prev-img-area mb-4">
                    <img
                      src={`${process.env.PUBLIC_URL}/meetingroom/haein01.jpg`}
                      alt="대표 이미지"
                    />
                  </div>
                  <div className="form-group line-input-group">
                    <label htmlFor="inTeamImg" className="with-file"></label>
                    <div className="input-wrap file">
                      <input
                        className="form-control"
                        type="file"
                        name="inTeamImg"
                        id="inTeamImg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="contents-box input-box">
                  {/* 팀 이름 입력 */}
                  <div className="form-group line-input-group mb-4">
                    <div className="row mb-3">
                      <label htmlFor="roomname" className="col-xl-3 col-lg-3 col-form-label">팀</label>
                      <div className="col-xl-9 col-lg-9">
                        <div className="input-wrap in-team-name">
                          <input type="text" className="form-control" id="roomname" />
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
                          <input type="text" className="form-control" id="roomname" />
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
                            <input type="number" className="form-control w-80" id="roomname" min="1" max="1000" defaultValue="20" />
                            <span>명</span>
                          </div>
                          <div className="form-check custom-chk mt-3 mb-3">
                            <input className="form-check-input" type="checkbox" id="flexCheckChecked" defaultChecked />
                            <label className="form-check-label" htmlFor="flexCheckChecked">
                              대기방 미팅 입장권이 있는 사람만 참여
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 관리자 입력 */}
                  <div className="form-group line-input-group mb-4">
                    <div className="row mb-3">
                      <label htmlFor="roomname" className="col-xl-3 col-lg-3 col-form-label">관리자</label>
                      <div className="col-xl-9 col-lg-9">
                        <div className="input-wrap in-team-name">
                          <input type="text" className="form-control" id="roomname" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 인당 미팅시간 입력 */}
                  <div className="form-group line-input-group mb-4">
                    <div className="row mb-3">
                      <label htmlFor="roomname" className="col-xl-3 col-lg-3 col-form-label">인당 미팅시간</label>
                      <div className="col-xl-9 col-lg-9">
                        <div className="input-wrap">
                          <input type="number" className="form-control w-80" id="roomname" min="1" max="1000" defaultValue="20" />
                          <span>명</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 사이 쉬는시간 입력 */}
                  <div className="form-group line-input-group mb-4">
                    <div className="row mb-3">
                      <label htmlFor="roomname" className="col-xl-3 col-lg-3 col-form-label">사이 쉬는시간</label>
                      <div className="col-xl-9 col-lg-9 d-flex">
                        <div className="input-wrap me-4">
                          <input type="number" className="form-control w-80" id="roomname" min="1" max="1000" defaultValue="20" />
                          <span>인당</span>
                        </div>
                        <div className="input-wrap">
                          <input type="number" className="form-control w-80" id="roomname" min="1" defaultValue="20" />
                          <span>분</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 미팅 시작시간 입력 */}
                  <div className="form-group line-input-group mb-4">
                    <div className="row mb-3">
                      <label htmlFor="roomname" className="col-xl-3 col-lg-3 col-form-label">미팅 시작시간</label>
                      <div className="col-xl-9 col-lg-9 d-flex">
                        <div className="input-group">
                          <div className="input-wrap date me-4 pb-1 pt-1">
                            <input type="date" className="form-control" id="roomname" />
                          </div>
                          <div className="input-wrap time pb-1 pt-1">
                            <input type="time" className="form-control" id="roomname" />
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
              <button className="btn btn-primary ms-3">방 생성</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateRoom;
