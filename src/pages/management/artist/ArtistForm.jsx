import { useState } from "react";
import axios from "axios";
import "./css/artistform.css";
import { useParams } from "react-router-dom";

const ArtistForm = () => {
    const managementuuid = '32eb55e2-022c-4741-8a41-d32916480b4e'; //hard coding
    // const {managementuuid} = useParams();
    const [name, setName] = useState('');
    const [debut,setDebut] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birth, setBirth] = useState('');
    const [uploadfile, setUploadfile] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async(e)=>{
        e.preventDefault();

        const formData = new FormData();
        formData.append('managementuuid',managementuuid);
        formData.append('name',name);
        formData.append('debut',debut);
        formData.append('email',email);
        formData.append('password',password);
        formData.append('birth',birth);
        if(uploadfile){
            formData.append('uploadfile',uploadfile);
        }
        // FormData의 모든 필드를 확인하는 방법
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try{
            const response = await axios.post('http://localhost:8080/management/artist', formData);
            setMessage(`아티스트가 성공적으로 등록되었습니다 : ${response.data.name}`);
            setName('');
            setBirth('');
            setDebut('');
            setEmail('');
            setPassword('');
            setUploadfile(null);
        }catch(error){
            setMessage('아티스트 등록에 실패하였습니다.');
            console.error('Error creating artist : ', error)
        }
    };
    return (
        <div className="artist-form-container">
            <h2>아티스트 등록</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>데뷔일</label>
                    <input
                        type="date"
                        value={debut}
                        onChange={(e) => setDebut(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>이메일</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>생년월일</label>
                    <input
                        type="date"
                        value={birth}
                        onChange={(e) => setBirth(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>파일 업로드</label>
                    <input
                        type="file"
                        onChange={(e) => setUploadfile(e.target.files[0])}
                        className="form-control"
                    />
                </div>
                <button type="submit" id="submitBtn">등록</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
    

};
export default ArtistForm;