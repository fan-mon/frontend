import React, { useState } from 'react';
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts/bootstrap-icons.min.css';
import "./css/stayroom.css";

function MeetingRoom() {
  useEffect(() => {
    // 이벤트 리스너 정의
    const handleHeaderMenuClick = () => {
      document.querySelector('.header-wrap').classList.toggle('side-min');
    };
    
    const handleSearchClick = () => {
      document.querySelector('.header').classList.toggle('search-all');
    };
    
    const handleChatBoxClick = () => {
      document.querySelector('.chatroom-area').classList.add('open');
    };

    const handleChatCloseClick = () => {
      document.querySelector('.chatroom-area').classList.remove('open');
    };

    const handleScreenToggleClick = (event) => {
      event.currentTarget.classList.toggle('on');
      document.querySelector('.meeting-show-area').classList.toggle('full');
      document.querySelector('.control-box').classList.toggle('floating');
    };

    const handleControlToggleClick = (event) => {
      const btn = event.currentTarget;
      const input = btn.parentNode.querySelector('.form-control');
      const span = btn.parentNode.querySelector('.vol');
      const slice = btn.parentNode.querySelector('.control-slice');
      const gauge = slice.querySelector('.gauge');

      btn.classList.toggle('mute');
      slice.classList.toggle('mute-control');

      if (btn.classList.contains('mute')) {
        span.textContent = input.value;
        input.value = 0;
        gauge.style.width = '0%';
      } else {
        input.value = span.textContent;
        gauge.style.width = `${span.textContent}%`;
      }
    };

    // 이벤트 등록
    document.getElementById('headerBtnMenu').addEventListener('click', handleHeaderMenuClick);
    document.querySelector('.btn-search').addEventListener('click', handleSearchClick);
    document.querySelector('.chat-mini-box').addEventListener('click', handleChatBoxClick);
    document.querySelector('.btn-chat-close').addEventListener('click', handleChatCloseClick);
    document.querySelector('.btn-screen-toggle').addEventListener('click', handleScreenToggleClick);
    document.querySelectorAll('.btn-control-toggle').forEach((btn) => {
      btn.addEventListener('click', handleControlToggleClick);
    });

    return () => {
      // 이벤트 정리
      document.getElementById('headerBtnMenu').removeEventListener('click', handleHeaderMenuClick);
      document.querySelector('.btn-search').removeEventListener('click', handleSearchClick);
      document.querySelector('.chat-mini-box').removeEventListener('click', handleChatBoxClick);
      document.querySelector('.btn-chat-close').removeEventListener('click', handleChatCloseClick);
      document.querySelector('.btn-screen-toggle').removeEventListener('click', handleScreenToggleClick);
      document.querySelectorAll('.btn-control-toggle').forEach((btn) => {
        btn.removeEventListener('click', handleControlToggleClick);
      });
    };
  }, []);

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
                <div className="meeting-show-area">
                  <button className="btn btn-ico btn-screen-toggle">
                    <i className="bi bi-fullscreen" />
                    <i className="bi bi-fullscreen-exit" />
                  </button>
                </div>
              </div>
              <div className="contents-box control-box">
                <div className="control-left-area">
                  <div className="control-item-wrap control-item-volume">
                    <button className="btn btn-ico btn-control-toggle btn-volumn-toggle">
                      <i className="bi bi-volume-off-fill" />
                      <i className="bi bi-volume-mute-fill" />
                    </button>
                    <div className="control-slice control-slice-volume">
                      <div className="track">
                        <div className="gauge" />
                      </div>
                    </div>
                    <label htmlFor="volume" className="hidden-label">볼륨 크기</label>
                    <input id="volume" className="form-control" type="text" value="50" readOnly />
                    <span className="hidden-label vol" />
                  </div>

                  <div className="control-item-wrap control-item-mike">
                    <button className="btn btn-ico btn-control-toggle btn-mic-toggle">
                      <i className="bi bi-mic-fill" />
                      <i className="bi bi-mic-mute-fill" />
                    </button>
                    <div className="control-slice control-slice-mike">
                      <div className="track">
                        <div className="gauge" />
                      </div>
                    </div>
                    <label htmlFor="mike" className="hidden-label">볼륨 크기</label>
                    <input id="mike" className="form-control" type="text" value="50" readOnly />
                    <span className="hidden-label vol" />
                  </div>
                </div>
                <div className="control-right-area">
                  <p>
                    <span className="label">남은시간</span>
                    <span className="implement-txt meeting-time">02:48</span>
                  </p>
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