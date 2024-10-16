import React, { useEffect, useState } from 'react';
import "./css/goodsupdate.css";
import api from '../../../apiClient';
// import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function GoodsUpdate() {
    const [mgName, setMgName] = useState('로그인 안됨');
    const [managementuuid, setManagementuuid] = useState('');
    const { goodsuuid } = useParams(); //url에서 goodsuuid 가져오기

    const [gdetail, setGDetail] = useState([]); //원래 굿즈 detail정보 담을것
    const [file, setFile] = useState(null); //파일 업로드 위해서

    const navigate = useNavigate();

    //로그인된 management 정보 가져오기
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
    //원래 굿즈 detail 정보 가져오기 api 호출
    const fetchGoodsDetail = async () => {
        try {
            // sessionStorage.setItem('goodsuuid',goodsuuid); //세션에 goodsuuid저장
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/goods/${goodsuuid}`);
            setGDetail(response.data);
            console.log(gdetail);
        } catch (err) {
            console.error('Error fetching goods detail');
        }
    };

    useEffect(() => {
        fetchManagementInfo();
        fetchGoodsDetail();
    }, [goodsuuid]);

    const handleChange = (e) => {
        const { name, value } = e.target; // 입력 이벤트에서 name과 value를 가져옴
        setGDetail(prevDetail => ({
            ...prevDetail, // 기존 상태를 펼쳐서 새로운 객체를 만듦
            [name]: value // 변경된 필드의 이름에 해당하는 값을 업데이트
        }));

        console.log(gdetail);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('goodsuuid', gdetail.goodsuuid);
        formData.append('managementuuid', managementuuid);
        formData.append('teamuuid', gdetail.team.teamuuid);
        formData.append('name', gdetail.name);
        formData.append('description', gdetail.description);
        formData.append('price', gdetail.price);
        formData.append('qty', gdetail.qty);
        formData.append('fname',gdetail.fname);
        if (file) {
            formData.append('uploadfile', file);
        }
        // FormData의 모든 필드를 확인하는 방법
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/management/goods/${goodsuuid}`, formData)
            .then(response => {
                alert('상품 수정이 완료되었습니다.');

                navigate(`/management/manageGoodsDetail/${goodsuuid}`); // 수정 후 상세 페이지로 이동
            })
            .catch(error => {
                alert('상품 수정에 실패하였습니다.');
                console.error('Error updating goods:', error);
            });
    };

    return (
        <div className="update-container">
            <h2>상품 수정</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>상품 이름</label>
                    <input
                        type="text"
                        name="name"
                        value={gdetail.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>상품 카테고리</label>
                    <select
                        id="category"
                        name="category"
                        value={gdetail.category}
                        onChange={handleChange}
                    >
                        <option value="">선택하세요</option>
                        <option value="ALBUM">앨범</option>
                        <option value="MAGAZINE">잡지류</option>
                        <option value="PHOTOBOOK">포토북</option>
                        <option value="COLLAB">콜라보</option>
                        <option value="MERCH">상품</option>
                        <option value="DVD">DVD</option>
                        <option value="OTHERS">기타</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>상품 설명</label>
                    <textarea
                        name="description"
                        value={gdetail.description}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>가격</label>
                    <input
                        type="number"
                        name="price"
                        value={gdetail.price}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>수량</label>
                    <input
                        type="number"
                        name="qty"
                        value={gdetail.qty}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>이미지 파일</label>
                    <input
                        type="file"
                        id="uploadfile"
                        accept='image/*'
                        onChange={handleFileChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">수정 완료</button>
            </form>
        </div>
    );
}

export default GoodsUpdate;
