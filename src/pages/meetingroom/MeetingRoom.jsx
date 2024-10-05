import React, { useState, useRef, useEffect} from 'react';
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts/bootstrap-icons.min.css';
import "./css/stayroom.css";

function MeetingRoom() {
  const [isSideMin, setIsSideMin] = useState(false);
  const [isSearchAll, setIsSearchAll] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuteVolume, setIsMuteVolume] = useState(false);
  const [isMuteMic, setIsMuteMic] = useState(false);
  const [volume, setVolume] = useState(50);
  const [mic, setMic] = useState(50);

    const volumeControlRef = useRef(null);
    const micControlRef = useRef(null);

    const toggleSideMenu = () => setIsSideMin(!isSideMin);
    const toggleSearchAll = () => setIsSearchAll(!isSearchAll);
    const openChat = () => setIsChatOpen(true);
    const closeChat = () => setIsChatOpen(false);
    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    const toggleMute = (control, setMute, setLevel) => {
        setMute(prev => !prev);
        if (control === "volume") {
            setLevel(isMuteVolume ? volume : 0);
        } else if (control === "mic") {
            setLevel(isMuteMic ? mic : 0);
        }
    };

    const handleVolumeChange = (e, setLevel) => {
        if (e.buttons === 1) {
            const gaugeWidth = e.nativeEvent.offsetX;
            setLevel(Math.min(100, Math.max(0, gaugeWidth)));
        }
    };

    useEffect(() => {
        const handleMouseUp = () => {
            if (volumeControlRef.current) volumeControlRef.current.classList.remove("on");
            if (micControlRef.current) micControlRef.current.classList.remove("on");
        };

        document.body.addEventListener("mouseup", handleMouseUp);
        return () => document.body.removeEventListener("mouseup", handleMouseUp);
    }, []);

  return (
    <>
      <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <div className={`meetingroom-wrap ${isSideMin ? 'side-min' : ''}`}>
                        <button id="headerBtnMenu" onClick={toggleSideMenu}>Toggle Menu</button>
                        <button className="btn-search" onClick={toggleSearchAll}>Toggle Search</button>
                        <div className={`header ${isSearchAll ? 'search-all' : ''}`}></div>
                        <button className="chat-mini-box" onClick={openChat}>Open Chat</button>
                        {isChatOpen && <div className="chatroom-area open">
                            <button className="btn-chat-close" onClick={closeChat}>Close Chat</button>
                        </div>}
                        <div className="contents-box meeting-box">
                            <div className="title-wrap">
                                <p className="sub-title">온라인 팬미팅 대기방</p>
                                <p className="title">
                                    <span className="group-name">데이식스</span>
                                    <span className="ml-3 mr-3">-</span>
                                    <span className="member-names">성진, YoungK, 원필, 도운</span>
                                </p>
                            </div>
                            <div className={`meeting-show-area ${isFullscreen ? 'full' : ''}`}>
                                <button className="btn btn-ico btn-screen-toggle" onClick={toggleFullscreen}>
                                    <i className="bi bi-fullscreen" />
                                    <i className="bi bi-fullscreen-exit" />
                                </button>
                            </div>
                        </div>
                        <div className="contents-box control-box">
                            <div className="control-left-area">
                                {/* Volume Control */}
                                <div className="control-item-wrap control-item-volume" ref={volumeControlRef}>
                                    <button
                                        className="btn btn-ico btn-control-toggle btn-volume-toggle"
                                        onClick={() => toggleMute("volume", setIsMuteVolume, setVolume)}
                                    >
                                        <i className="bi bi-volume-off-fill" />
                                        <i className="bi bi-volume-mute-fill" />
                                    </button>
                                    <div
                                        className="control-slice control-slice-volume"
                                        onMouseDown={() => volumeControlRef.current.classList.add("on")}
                                        onMouseMove={(e) => handleVolumeChange(e, setVolume)}
                                    >
                                        <div className="track">
                                            <div className="gauge" style={{ width: `${volume}%` }} />
                                        </div>
                                    </div>
                                    <label htmlFor="volume" className="hidden-label">볼륨 크기</label>
                                    <input id="volume" className="form-control" type="text" value={volume} readOnly />
                                    <span className="hidden-label vol">{volume}</span>
                                </div>

                                {/* Mic Control */}
                                <div className="control-item-wrap control-item-mic" ref={micControlRef}>
                                    <button
                                        className="btn btn-ico btn-control-toggle btn-mic-toggle"
                                        onClick={() => toggleMute("mic", setIsMuteMic, setMic)}
                                    >
                                        <i className="bi bi-mic-fill" />
                                        <i className="bi bi-mic-mute-fill" />
                                    </button>
                                    <div
                                        className="control-slice control-slice-mic"
                                        onMouseDown={() => micControlRef.current.classList.add("on")}
                                        onMouseMove={(e) => handleVolumeChange(e, setMic)}
                                    >
                                        <div className="track">
                                            <div className="gauge" style={{ width: `${mic}%` }} />
                                        </div>
                                    </div>
                                    <label htmlFor="mic" className="hidden-label">마이크 크기</label>
                                    <input id="mic" className="form-control" type="text" value={mic} readOnly />
                                    <span className="hidden-label vol">{mic}</span>
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