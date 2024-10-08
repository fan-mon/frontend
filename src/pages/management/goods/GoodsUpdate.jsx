import React, { useEffect, useState } from 'react';
import "./css/goodsupdate.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function GoodsUpdate() {
    const managementuuid = '32eb55e2-022c-4741-8a41-d32916480b4e'; //hard coding(세션유지)
    const { goodsuuid: urlGoodsuuid} = useParams(); //url에서 goodsuuid 가져오기
    const goodsuuid = urlGoodsuuid || sessionStorage.getItem('goodsuuid'); //세션 저장소에서 가져오기

    const navigate = useNavigate();
    const [gdetail, setGDetail] = useState([]);
    const [file, setFile] = useState(null); //파일 업로드 위해서

    useEffect(() => {
        if(goodsuuid){
            sessionStorage.setItem('goodsuuid',goodsuuid);
            axios.get(`http://localhost:8080/management/goods/${goodsuuid}`)
                .then(response => {
                    setGDetail(response.data);
                    console.log(gdetail.data);
                })
                .catch(error => {
                    console.error('Error fetching goods:', error);
                });
        }

    }, [goodsuuid]);

    const handleChange = (e) => {
        const { name, value } = e.target; // 입력 이벤트에서 name과 value를 가져옴
        setGDetail(prevDetail => ({
            ...prevDetail, // 기존 상태를 펼쳐서 새로운 객체를 만듦
            [name]: value // 변경된 필드의 이름에 해당하는 값을 업데이트
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('managementuuid',gdetail.managementuuid);
        formData.append('teamuuid',gdetail.teamuuid);
        formData.append('name', gdetail.name);
        formData.append('description',gdetail.description);
        formData.append('price',gdetail.price);
        formData.append('qty',gdetail.qty);
        if(file){
            formData.append('file',file);
        }

        axios.put(`http://localhost:8080/management/goods/${goodsuuid}`, formData)
            .then(response => {
                alert('상품 수정이 완료되었습니다.');
                navigate(`/management/manageGoodsDetail/${goodsuuid}`); // 수정 후 상세 페이지로 이동
            })
            .catch(error => {
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
                        value={gdetail.fname}
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
