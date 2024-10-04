import { useState } from "react";
import axios from "axios";
import "./css/goodsform.css";

const GoodsForm = () => {

    const [name, setName] = useState('');
    const [qty, setQty] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [uploadfile, setUploadfile] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', parseFloat(price));
        formData.append('qyt', qty);
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
            const response = await axios.post('http://localhost:8080/management/goods', formData, {
                // headers : {
                //     'Content-Type': 'multipart/form-data', //파일 업로드를 위한 헤더 설정
                // },
            });
            setMessage('상품이 성공적으로 등록되었습니다 : ${response.data.name}');
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
        <div>
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
    );
};

export default GoodsForm;