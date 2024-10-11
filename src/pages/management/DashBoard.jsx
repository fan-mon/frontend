import React, { useEffect, useState } from 'react';
import api from '../../apiClient';
import './dashboard.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


const DashBoard = () => {
    const [mgName, setMgName] = useState('로그인 안됨');
    const [managementuuid, setManagementuuid] = useState('');

    const [teamlist, setTeamlist] = useState([]); //팀 팔로워수별 정렬 
    const [goodslist, setGoodslist] = useState([]); //굿즈 판매량별 정렬

    const settingIcon = `${process.env.PUBLIC_URL}/management/setting_icon.png`; // public 폴더의 URL
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

        } catch (error) {
          console.error("사용자 정보 가져오기 오류:", error);
        }
    };

    //팀 팔로워수 orderby한거 호출 
    const fetchTeamList = async () => {
        try{
            console.log(managementuuid);
            const response = await axios.get(`http://localhost:8080/management/team/orderby/${managementuuid}`);
            setTeamlist(response.data);
            console.log(response.data);
        }catch(error){
            console.error("follower별 TeamList 호출 api error");
        }
    }

    //굿즈 판매량별 정렬한거 호출
    const fetchGoodsList = async () => {
        try{
            const response = await axios.get("http://localhost:8080/management/ordersdetail/goodsCount");
        }catch(error){
            console.error("판매량순 Goods 호출 api error");
        }
    }

    useEffect(()=>{
        const fetchData = async () => {
            await fetchManagementInfo();
            fetchTeamList();
            fetchGoodsList();
        }
        fetchData();
    },[managementuuid]);

    return (
        <div className="dashboard-content">
            <div className="stats">
                <div className="stat-card followers-card">
                    <h3>팔로워수</h3>
                    <ol>
                        <li>케니스</li>
                        <li>얌하나</li>
                        <li>소피노</li>
                        <li>소정화</li>
                        <li>김블루</li>
                        <li>영진아</li>
                        <li>안미용</li>
                    </ol>
                </div>
                <div className="stat-card artist-card">
                    <h3>아티스트</h3>
                    <p>15</p>
                    <img
                        src={settingIcon}
                        alt="Settings"
                        className="settings-icon"
                        onClick={() => navigate(`/management/artistList`)} // 설정 페이지로 이동
                    />
                </div>
                <div className="stat-card group-card">
                    <h3>그룹</h3>
                    <p>5</p>
                    <img
                        src={settingIcon}
                        alt="Settings"
                        className="settings-icon"
                        onClick={() => navigate(`/management/teamList`)} // 설정 페이지로 이동
                    />
                </div>
                <div className="stat-card goods-card">
                    <h3>굿즈</h3>
                    <p>20</p>
                    <img
                        src={settingIcon}
                        alt="Settings"
                        className="settings-icon"
                        onClick={() => navigate(`/management/goodsManage`)} // 설정 페이지로 이동
                    />
                </div>
            </div>

            <div className="goods-info">
                <div className="stat-card sales-amount-card">
                    <h3>굿즈 판매량</h3>
                    <p>102</p>
                    <p>100,800원</p>
                </div>
                <div className="stat-card sales-ranking-card">
                    <h3>굿즈 판매순</h3>
                    <ol>
                        <li>케니스</li>
                        <li>얌하나</li>
                        <li>소피노</li>
                        <li>소정화</li>
                        <li>김블루</li>
                        <li>영진아</li>
                        <li>안미용</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
