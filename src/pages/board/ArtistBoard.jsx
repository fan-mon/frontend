import {useState, useEffect, useRef} from "react";
import axios, {get} from "axios";

const ArtistBoard = ({ teamUuid}) => {
    const [artistBoards, setArtistBoards] = useState([]);
    const [content, setContent] = useState("");
    const fileInputRef = useRef(null);
    const [editindex, setEditindex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);
    const [editcontent, setEditcontent] = useState("");

    useEffect(() => {
        getList();
    }, [teamUuid]);

    // read
    const getList=async ()=>{
        try{
            const response=await axios.get(`http://localhost:8080/board/artistboard/${teamUuid}`)
            setArtistBoards(response.data);
        }catch (e) {
            console.log(e);
        }finally {
        }
    }
    //image
    const handleImageSelect = (event) => {
        const file = event.target.files[0]; // 선택한 파일 가져오기
        if (file) {
            console.log(`선택한 파일: ${file.name}`); // 파일 이름 출력
            setImage(file);
        } else {
            console.log('파일이 선택되지 않았습니다.');
        }
    };
    //create
    const posting = async (e)=>{
        // e.preventDefault();
        const formData = new FormData();
        console.log(`콘텐츠 내용 : ${content}`)
        const postData = {
            artist: {
                artistuuid: localStorage.getItem("uuid"),
            },
            content: content,
            createdat: null,
            updatedat: null,
            likecount: 0,
            team: {
                teamuuid: teamUuid
            },
            artistboarduuid: null,
        }
        console.log(JSON.stringify(postData));
        console.log(`폼 데이터 : ${formData}`)
        formData.append('image', image);
        formData.append('post',JSON.stringify(postData));
        // log formData 내용
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        try {
            const response = await axios.post("http://localhost:8080/board/artistboard", formData);
            console.log(response.data);
            await getList(); // getList가 비동기 함수이므로 처리가 완료될때까지 await으로 기다린다.
        }catch (e){
            console.log(e);
        }finally {
            setImage(null);
            setEditcontent("");
        }
    }

    //update
    const update = async (board) => {
        const formData = new FormData();
        const postData = {
            artist: {
                artistuuid: localStorage.getItem("uuid"),
            },
            content: editcontent, // 수정할 경우 editcontent 사용
            createdat: board.createdat,
            updatedat: board.updatedat,
            likecount: board.likecount,
            team: {
                teamuuid: teamUuid
            },
            artistboarduuid: board.artistboarduuid,
        };

        formData.append('image', image);
        formData.append('post', JSON.stringify(postData));


        try {
            const response = await axios.put(`http://localhost:8080/board/artistboard/put`, formData);
            console.log(response.data);
            await getList(); // 게시물 목록 새로 고침
        } catch (e) {
            console.log(e);
        } finally {
            setImage(null);
            setEditcontent("");
        }
    };


    //delete
    const deleteBoard=async (artistboarduuid)=>{
        try{
            await axios.delete(`http://localhost:8080/board/artistboard/${artistboarduuid}`, artistboarduuid);
            console.log("삭제완료")
        }catch (e) {
        }
        await getList();
    }
    return (
        <div className="artist-board-wrap">
            <div className="board-title">
                ARTIST BOARD
            </div>
            {localStorage.getItem("user") === 'ARTIST' ?
                <div className="new-post-wrap">
                    <div className="content">
                        <textarea className="writing-box" name="content"
                                  id="content" cols="30" maxLength="150" rows="10"
                                  placeholder="150자 이내 작성" value={content}
                                  onChange={(e) => setContent(e.target.value)}>
                        </textarea>
                        <button className="send-post" onClick={posting}>POST</button>
                    </div>
                    <div className="add-photo">
                        <button className="photo-button"
                                onClick={() => fileInputRef.current.click()}>사진 첨부하기
                        </button>
                        <input type="file"
                               accept="image/*"
                               style={{display: 'none'}} // input 요소 숨기기
                               ref={fileInputRef}
                               onChange={handleImageSelect}/>
                    </div>
                </div>
                : null}
            {artistBoards && artistBoards.length > 0 ? (
                artistBoards.slice().reverse().map((board, index) => (
                    <div key={index} className="artistboard-content-wrap">
                        {localStorage.getItem("uuid") === board.artist.artistuuid ?
                            <div className="writer-button">
                                <button className="edit-button"
                                        onClick={() => {
                                            if (isEditing) {
                                                // 수정 함수 실행
                                                update(board);
                                                setIsEditing(false); // 수정 모드 종료
                                            } else {
                                                setEditcontent(board.content);
                                                setEditindex(index);
                                                setIsEditing(true);
                                            }
                                        }}>수정
                                </button>
                                {isEditing ?
                                    (<button className="canceledit-button"
                                             onClick={() => {
                                                 setIsEditing(false)
                                             }}>취소</button>)
                                    :
                                    (<button className="delete-button"
                                             onClick={() => {
                                                 deleteBoard(board.artistboarduuid)
                                             }}>삭제</button>)
                                }
                            </div>
                            :
                            null
                        }
                        <div key={board.artistboarduuid} className="board-content">
                            <div className="content-left">
                                <div className="writer-photo">
                                    <img src="" alt="wrtier-photo"/>
                                </div>
                                <div className="like">
                                    <p>♥ {board.likecount}</p>
                                </div>
                            </div>
                            <div className="content-right">
                                <div className="content-right-top">
                                    <div className="wrtier">
                                        {board.artist.name}
                                    </div>
                                    <div className="date">
                                        {new Date(board.createdat).toLocaleDateString('ko-KR')} {new Date(board.createdat).toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    </div>
                                </div>
                                <div className="content-right-bottom">
                                    {isEditing && index === editindex ?
                                        (<div><textarea className="edit-content"
                                                        onChange={(e) => setEditcontent(e.target.value)}
                                                        value={editcontent}/>
                                                <div className="add-photo">
                                                    <button className="photo-button"
                                                            onClick={() => fileInputRef.current.click()}>사진 첨부하기
                                                    </button>
                                                    <input type="file"
                                                           accept="image/*"
                                                           style={{display: 'none'}} // input 요소 숨기기
                                                           ref={fileInputRef}
                                                           onChange={handleImageSelect}/>
                                                </div>
                                            </div>
                                        )
                                        :
                                        (<div className="content">
                                            {board.content}
                                        </div>)
                                    }
                                    {board.fname ?
                                        <div className="content-img">
                                            <img src={board.fname} alt="content-image"
                                                 style={{width: "300px", height: "300px"}}/>
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                            </div>
                        </div>
                        <hr/>
                    </div>
                ))
            ) : (
                <p>No artist boards available.</p>
            )}
        </div>
    );
};

export default ArtistBoard;