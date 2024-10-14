import { useState, useEffect } from "react";
import axios from "axios";
import api from '../../../apiClient';
import "./css/goodsform.css";
import { useParams } from "react-router-dom";

const GoodsForm = () => {
    const [mgName, setMgName] = useState('로그인 안됨');
    const [managementuuid, setManagementuuid] = useState('');

    const { teamuuid } = useParams();
    const [name, setName] = useState('');
    const [qty, setQty] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [uploadfile, setUploadfile] = useState(null);
    const [message, setMessage] = useState('');

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

    useEffect(() => {
        fetchManagementInfo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('managementuuid', managementuuid);
        formData.append('teamuuid', teamuuid);
        formData.append('name', name);
        formData.append('price', parseFloat(price));
        formData.append('qty', qty);
        formData.append('description', description);
        formData.append('category', category);
        if (uploadfile) {
            formData.append('uploadfile', uploadfile);
        }

        // FormData의 모든 필드를 확인하는 방법
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/management/goods`, formData);
            setMessage(`상품이 성공적으로 등록되었습니다 : ${response.data.name}`);
            //폼 초기화
            setName('');
            setPrice('');
            setDescription('');
            setQty('');
            setUploadfile(null);
            setCategory('');

        } catch (error) {
            setMessage('상품 등록에 실패하였습니다.');
            console.error('Error creating goods : ', error);
        }

    };

    return (
        <body className="goodsform">
            <div className="goods-form-container">
                <h2>상품 등록</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div>
                        <label htmlFor="name">상품명:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required //필수입력 필드
                        />
                    </div>
                    <div>
                        <label htmlFor="category">카테고리:</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
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
                    <div>
                        <label htmlFor="price">가격:</label>
                        <input
                            type="text"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="qty">수량:</label>
                        <input
                            type="text"
                            id="qty"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description">설명:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}

                        />
                    </div>
                    <div>
                        <label htmlFor="uploadfile">이미지:</label>
                        <input
                            type="file"
                            id="uploadfile"
                            accept="image/*" //이미지 파일만 선택 가능
                            onChange={(e) => setUploadfile(e.target.files[0])}
                        //여러개의 파일을 올렸을 경우 첫번째 파일 참조
                        />
                    </div>
                    <button type="submit" id="submitBtn">등록</button>
                </form>
                {message && <p>{message}</p>}

            </div>
        </body>
    );
};

export default GoodsForm;