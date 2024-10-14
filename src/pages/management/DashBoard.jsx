import React, { useEffect, useState } from 'react';
import api from '../../apiClient';
import './dashboard.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


const DashBoard = () => {
    const [mgName, setMgName] = useState('로그인 안됨');
    const [managementuuid, setManagementuuid] = useState('');

    const [artistCount, setArtistCount] = useState(0); //아티스트 개수
    const [teamCount, setTeamCount] = useState(0); //팀 개수
    const [goodsCount, setGoodsCount] = useState(0); //굿즈 개수

    const [teamlist, setTeamlist] = useState([]); //팀 팔로워수별 정렬 
    const [goodslist, setGoodslist] = useState([]); //굿즈 판매량별 정렬

    const [sumGoodsQty, setSumGoodsQty] = useState(0); //굿즈 총 판매량
    const [sumGoodsTotalcost, setSumGoodsTotalcost] = useState(0); //굿즈 총 판매액

    const [showTooltip, setShowTooltip] = useState(false);
    const [showTooltip2, setShowTooltip2] = useState(false);
    const [showTooltip3, setShowTooltip3] = useState(false);
    const settingIcon = `${process.env.PUBLIC_URL}/management/setting_icon2.png`; // public 폴더의 URL
    const navigate = useNavigate();

    //로그인한 management 정보 가져오기
    const fetchManagementInfo = async () => {
        try {
            const response = await api.get('/management/myprofile');
            console.log(response.headers); // 응답 헤더 출력
            console.log(response.data); // 사용자 정보 로그 출력
            setMgName(response.data.name);
            setManagementuuid(response.data.managementuuid);
            console.log(response.data.managementuuid);

            //managementuuid가 설정된 후 다른 fetch 호출
            await fetchArtistCount(response.data.managementuuid);
            await fetchTeamCount(response.data.managementuuid);
            await fetchGoodsCount(response.data.managementuuid);
            await fetchSumGoodsQty(response.data.managementuuid);
            await fetchSumGoodsTotalcost(response.data.managementuuid);
            await fetchTeamList(response.data.managementuuid);
            await fetchGoodsList(response.data.managementuuid);
        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
        }
    };

    //아티스트 개수 COUNT
    const fetchArtistCount = async (uuid) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/artist/count/${uuid}`);
            setArtistCount(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("아티스트 개수 count 호출 api error");
        }
    }

    //아티스트 개수 COUNT
    const fetchTeamCount = async (uuid) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/team/count/${uuid}`);
            setTeamCount(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("팀 개수 count 호출 api error");
        }
    }

    //굿즈 개수 COUNT
    const fetchGoodsCount = async (uuid) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/goods/count/${uuid}`)
            setGoodsCount(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("굿즈 개수 count 호출 api error");
        }
    }

    //팀 팔로워수 orderby한거 호출 
    const fetchTeamList = async (uuid) => {
        try {
            console.log(uuid);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/team/followerorderby/${uuid}`);
            setTeamlist(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("follower별 TeamList 호출 api error");
        }
    }

    //굿즈 판매량별 orderby 한거 호출
    const fetchGoodsList = async (uuid) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/ordersdetail/qtyOrderby/${uuid}`);
            setGoodslist(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("판매량순 Goods Orderby호출 api error");
        }
    }

    //굿즈 총 판매량 SUM
    const fetchSumGoodsQty = async (uuid) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/ordersdetail/qtySum/${uuid}`);
            setSumGoodsQty(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Goods 총 판매량 SUM 호출 api error");
        }
    }

    //굿즈 총 판매액 SUM
    const fetchSumGoodsTotalcost = async (uuid) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/ordersdetail/totalcostSum/${uuid}`);
            setSumGoodsTotalcost(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Goods 총 판매액 SUM 호출 api error");
        }
    }

    useEffect(() => {
        fetchManagementInfo();
    }, []);

    return (
        <div className="dashboard-content">
            
            <div className="goods-info">
                <div className="stat-card followers-card">
                    <h3>팔로워수</h3>
                    <table>
                        <tbody>
                            {teamlist.slice(0, 5).map((team, index) => (
                                <tr key={team.teamuuid || index} onClick={()=>{navigate(`../management/teamDetail/${team.teamuuid}`)}}>
                                    <td><img src={`${process.env.REACT_APP_BACKEND_API_URL}/resources/teamimg/${team.fname}`} alt={team.name} className="team-image" /></td>
                                    <td>{team.name}</td>
                                    <td>{team.followers}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="stat-card sales-amount-card">
                    <h3>굿즈 총 판매현황</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td><p>총 {sumGoodsQty}개</p></td>
                                <td><p>총 {sumGoodsTotalcost}원</p></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="stats">
                <div className="number-card">
                    <div className="stat-card artist-card"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={() => navigate(`/management/artistList`)}>
                        <h3>아티스트</h3>
                        <p>{artistCount}</p>
                        {showTooltip && <img
                            src={settingIcon}
                            alt="Settings"
                            className="settings-icon"
                        />}
                    </div>
                    <div className="stat-card group-card"
                        onMouseEnter={() => setShowTooltip2(true)}
                        onMouseLeave={() => setShowTooltip2(false)}
                        onClick={() => navigate(`/management/teamList`)}>
                        <h3>그룹</h3>
                        <p>{teamCount}</p>
                        {showTooltip2 && <img
                            src={settingIcon}
                            alt="Settings"
                            className="settings-icon"
                        />}
                    </div>
                    <div className="stat-card goods-card"
                        onMouseEnter={() => setShowTooltip3(true)}
                        onMouseLeave={() => setShowTooltip3(false)}
                        onClick={() => navigate(`/management/goodsManage`)}>
                        <h3>굿즈</h3>
                        <p>{goodsCount}</p>
                        {showTooltip3 && <img
                            src={settingIcon}
                            alt="Settings"
                            className="settings-icon"
                        />}
                    </div>
                </div>
                <div className="stat-card sales-ranking-card">
                    <h3>굿즈 판매순</h3>
                    <table>
                        <tbody>
                            {goodslist.slice(0, 5).map((goods, index) => (
                                <tr key={goods.goods.goodsuuid || index}>
                                    <td><img src={`${process.env.REACT_APP_BACKEND_API_URL}/resources/goodsimg/${goods.goods.fname}`} alt={goods.goods.fname} className="goods-image" /></td>
                                    <td>{goods.goods.name}</td>
                                    <td>{goods.volume}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default DashBoard;
