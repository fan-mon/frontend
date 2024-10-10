import React, { useState, useEffect, useRef  } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts/bootstrap-icons.min.css';
import "./css/stayroom.css";
import "./js/meeting.js";
import "./js/webRTC.js";

function MeetingRoom() {
    return (
    <>
    <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="meetingroom-wrap">
              <div className="contents-box meeting-box">
                <div className="title-wrap">
                  <p className="sub-title">온라인 팬미팅 대기방</p>
                  <p className="title">
                    <span className="group-name">데이식스</span>
                    <span className="ml-3 mr-3">-</span>
                    <span className="member-names">성진, YoungK, 원필, 도운</span>
                  </p>
                </div>
                <div className="meeting-show-area video-area">
                    <button className="btn btn-ico btn-screen-toggle">
                        <i className="bi bi-fullscreen"></i>
                        <i className="bi bi-fullscreen-exit"></i>
                    </button>
                    <button className="btn btn-ico btn-hidden-ui">
                        <i className="bi bi-person-bounding-box"></i>
                        <i className="bi bi-grid-1x2"></i>
                    </button>
                    <video src="" id="peerFaceVideo" className="video peer-video" autoPlay playsInline></video>
                    <div className="meeting-show-mine video-area">
                      <video src="" id="myFaceVideo" className="video my-video" autoPlay playsInline></video>  
                    </div>
                </div>
              </div>
              <div className="contents-box control-box">
                <div className="control-left-area">
                  <div className="control-item-wrap control-item-volume">
                    <button className="btn btn-ico btn-control-toggle btn-volumn-toggle">
                      <i className="bi bi-volume-off-fill"></i>
                      <i className="bi bi-volume-mute-fill"></i>
                    </button>
                    <div className="control-slice control-slice-volume">
                      <div className="track">
                        <div className="gauge"></div>
                      </div>
                    </div>
                    <label htmlFor="volume" className="hidden-label">볼륨 크기</label>
                    <input id="volume" className="form-control" type="text" value="50" readOnly />
                    <span className="hidden-label vol">50</span>
                  </div>

                  <div className="control-item-wrap control-item-mike">
                    <button className="btn btn-ico btn-control-toggle btn-mic-toggle">
                      <i className="bi bi-mic-fill"></i>
                      <i className="bi bi-mic-mute-fill"></i>
                    </button>
                    <div className="control-slice control-slice-mike" id="btnMike">
                      <div className="track">
                        <div className="gauge"></div>
                      </div>
                    </div>
                    <label htmlFor="mike" className="hidden-label">볼륨 크기</label>
                    <input id="mike" className="form-control" type="text" value="50" readOnly />
                    <span className="hidden-label vol">50</span>
                  </div>
                  <div className="control-item-wrap">
                    <button className="btn btn-ico btn-control-camera" id="btnControlCamera">
                      <i className="bi bi-camera-video-fill"></i>
                      <i className="bi bi-camera-video-off-fill"></i>
                    </button>
                    <div className="form-group">
                      <select className="form-control sel-camera" name="" id="selCamera">
                      </select>
                    </div>
                  </div>
                </div>
                <div className="control-right-area">
                  <p>
                    <span className="label">남은시간</span>
                    <span className="implement-txt meeting-time">02:48</span>
                  </p>
                  <button className="btn btn-default me-2">잠시휴식</button>
                  <button className="btn btn-danger">긴급종료</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
    </>
    );
  }
  
  export default MeetingRoom;