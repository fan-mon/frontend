import {Link} from "react-router-dom"
import "./css/header.css"

import 'bootstrap/dist/css/bootstrap.min.css';
import {ListUl, ArrowBarLeft, BellFill, HeartFill, ThreeDotsVertical, HouseDoorFill, ChatHeartFill, CartFill, PersonSquare, QuestionCircleFill, XLg, Search, XCircleFill} from 'react-bootstrap-icons';

const Header = () => {
    const handleMenuToggle = () => {
        document.querySelector('.header-wrap').classList.toggle('side-min');
        //document.querySelector('.header').classList.toggle('side-min');
        //document.querySelector('.sidemenu').classList.toggle('side-min');
    };
    const handleSearchToggle = () => {
        document.querySelector('.header').classList.toggle('search-all');
    };

    return(
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
                            <input type="text" name="allSearch" id="allSearch" className="form-control in-all-search" placeholder="Search"/>
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
                        <a href="/index.html">
                    <span className="full-logo">
                        <img src={`${process.env.PUBLIC_URL}/common/logo.svg`} alt=""/>
                    </span>
                            <span className="symbol-logo">
                        <img src={`${process.env.PUBLIC_URL}/common/symbol.svg`} alt=""/>
                    </span>
                        </a>
                    </h1>
                    <div className="profile-wrap">
                        <div className="profile">
                            <img src={`${process.env.PUBLIC_URL}/common/upload/output_1061748631.jpeg`} alt=""/>
                        </div>
                        <div className="info">
                            <div className="username">임꺽정</div>
                            <div className="user-role">일반회원</div>
                        </div>
                        <div className="btn btn-ico btn-dropdown">
                            <ThreeDotsVertical />
                        </div>
                    </div>
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
                                    <span className="txt">커뮤니티</span>
                                </Link>
                            </li>
                            <li className="sidemenu-item sidemenu-goods">
                                <Link to="/">
                                    <span className="ico"><CartFill /></span>
                                    <span className="txt">굿즈샵</span>
                                </Link>
                            </li>
                            <li className="sidemenu-item sidemenu-meeting">
                                <Link to="/">
                                    <span className="ico"><PersonSquare /></span>
                                    <span className="txt">팬미팅</span>
                                </Link>
                            </li>
                            <li className="sidemenu-item sidemenu-qna">
                                <Link to="/">
                                    <span className="ico"><QuestionCircleFill /></span>
                                    <span className="txt">고객센터</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Header