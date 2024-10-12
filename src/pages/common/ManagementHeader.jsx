import { Link } from "react-router-dom";
import "./css/header.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ListUl, ArrowBarLeft, BellFill, HeartFill, ThreeDotsVertical, HouseDoorFill, ChatHeartFill, CartFill, PersonSquare, QuestionCircleFill, XLg, Search, XCircleFill } from 'react-bootstrap-icons';
import React, { useEffect, useState } from 'react';
import api from '../../apiClient';

const ManagementHeader = () => {
    const [userName, setUserName] = useState('이름 없음');
    const [showLogout, setShowLogout] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    const fetchUserInfo = async () => {
        try {
            const response = await api.get('/management/myprofile');
            setUserName(response.data.name);
            setIsLoggedIn(true); 
        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
            setIsLoggedIn(false); 
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchUserInfo();
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchUserInfo();
        }
    }, [localStorage.getItem('accessToken')]); // 토큰이 변경되면 다시 실행

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        setUserName('로그인 안됨');
        setIsLoggedIn(false); 
        window.location.href = '/management/dashboard';
    };

    const toggleLogoutMenu = () => {
        setShowLogout(prev => !prev);
    };

    const handleMenuToggle = () => {
        document.querySelector('.header-wrap').classList.toggle('side-min');
    };

    const handleSearchToggle = () => {
        document.querySelector('.header').classList.toggle('search-all');
    };

    return (
        <>
            <header className="header">
                <div className="container-fluid">
                    <div className="header-content-wrap">
                        <button className="btn btn-ico btn-menu" id="headerBtnMenu" onClick={handleMenuToggle}>
                            <ListUl />
                            <ArrowBarLeft />
                            <XLg />
                        </button>
                        <div className="form-group all-search-wrap">
                            <label className="hidden-label" htmlFor="allSearch">전체검색</label>
                            <input type="text" name="allSearch" id="allSearch" className="form-control in-all-search" placeholder="Search" />
                            <button className="btn btn-ico btn-search" onClick={handleSearchToggle}>
                                <Search />
                                <XCircleFill />
                            </button>
                        </div>
                        <button className="btn btn-ico btn-alert">
                            <span className="pin-circle-red"></span>
                            <BellFill />
                        </button>
                        <button className="btn btn-ico btn-love">
                            <HeartFill />
                        </button>
                    </div>
                </div>
            </header>
            <div className="sidemenu">
                <div className="sidemenu-content">
                    <h1 className="logo">
                        <a href="/management/dashboard">
                            <span className="full-logo">
                                <img src={`${process.env.PUBLIC_URL}/common/logo.svg`} alt="" />
                            </span>
                            <span className="symbol-logo">
                                <img src={`${process.env.PUBLIC_URL}/common/symbol.svg`} alt="" />
                            </span>
                        </a>
                    </h1>
                    <div className="profile-wrap">
                        <div className="profile">
                            <img src={`${process.env.PUBLIC_URL}/common/upload/output_1061748631.jpeg`} alt="" />
                        </div>
                        <div className="info">
                        <span className="username" 
                             onClick={() => {
                                  if (!isLoggedIn) {
                                      window.location.href = "/user/login"; // 로그인 페이지로 이동
                                   } else {
                                   window.location.href = "/management/managementmypage"; // 마이페이지로 이동
                                  }
                                }}
                         >{userName}</span>
                            <div className="user-role">기업회원</div>
                        </div>
                        <div className="btn btn-ico btn-dropdown" onClick={toggleLogoutMenu}>
                            <ThreeDotsVertical />
                        </div>
                    </div>
                    {showLogout && (
                        <div className="logout-menu">
                            {isLoggedIn ? (
                                <button onClick={handleLogout}>로그아웃</button>
                            ) : (
                                <Link to="/user/login"><button>로그인</button></Link>
                            )}
                        </div>
                    )}
                    <nav>
                        <ul>
                            <li className="sidemenu-item sidemenu-main">
                                <Link to="/">
                                    <span className="ico"><HouseDoorFill /></span>
                                    <span className="txt">메인화면</span>
                                </Link>
                            </li>
                            <li className="sidemenu-item sidemenu-commu">
                                <Link to="/chat">
                                    <span className="ico"><ChatHeartFill /></span>
                                    <span className="txt">메뉴1</span>
                                </Link>
                            </li>
                            <li className="sidemenu-item sidemenu-goods">
                                <Link to="/">
                                    <span className="ico"><CartFill /></span>
                                    <span className="txt">메뉴2</span>
                                </Link>
                            </li>
                            <li className="sidemenu-item sidemenu-meeting">
                                <Link to="/">
                                    <span className="ico"><PersonSquare /></span>
                                    <span className="txt">메뉴3</span>
                                </Link>
                            </li>
                            <li className="sidemenu-item sidemenu-qna">
                                <Link to="/">
                                    <span className="ico"><QuestionCircleFill /></span>
                                    <span className="txt">메뉴4</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default ManagementHeader;
