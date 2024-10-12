import {useState, useEffect, useRef} from "react";
import axios from "axios";
import {getList, handleImageSelect} from "./boardAPI/boardAPI";

const ArtistBoard = () => {
    const [artistBoards, setArtistBoards] = useState([]);
    const [content, setContent] = useState("");
    const fileInputRef = useRef(null);
    const [editindex, setEditindex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);
    const [editcontent, setEditcontent] = useState("");
    const ARTIST_BOARD_API_URL=`${process.env.REACT_APP_BACKEND_API_URL}/board/artistboard`
    const teamUuid='70d7f41e-86e4-11ef-b4db-0a2a78c30fc9'
    const artistUuid='29f343ca-86e4-11ef-b4db-0a2a78c30fc9'

    const artistBoardDataForm=(data=null, postContent=null)=>{
        console.log(data)
        console.log("content : "+postContent)
        let postData;
        if (data){
            postData = {
                artist: {
                    artistuuid: data.artist ? data.artist.artistuuid : localStorage.getItem("uuid")
                },
                content: content,
                createdat: data.createdat,
                updatedat: data.updatedat,
                likecount: data.likecount,
                team: {
                    teamuuid: data.team ? data.team.teamUuid : teamUuid,
                },
                artistboarduuid: data.artistboarduuid,
            };
        } else{
            postData = {
                    artist: {
                        artistuuid: artistUuid
                    },
                    content: postContent,
                    createdat: null,
                    updatedat: null,
                    likecount: 0,
                    team: {
                        teamuuid: teamUuid
                    },
                    artistboarduuid: null,
                }
        }
        return postData;
    }

    useEffect(() => {
        getList({
            API_URL: ARTIST_BOARD_API_URL,
            teamuuid: teamUuid,
            setArtistBoards: setArtistBoards,});
    },[teamUuid]);

    // create
    const posting = async (e,postData)=>{
        const formData = new FormData();
        console.log(JSON.stringify(postData));
        console.log(`폼 데이터 : ${formData}`)
        formData.append('image', image);
        formData.append('post',JSON.stringify(postData));
        // log formData 내용
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        try {
            const response = await axios.post(`${ARTIST_BOARD_API_URL}`, formData);
            console.log(response.data);
            await getList({
                API_URL: ARTIST_BOARD_API_URL,
                teamuuid: teamUuid,
                setArtistBoards: setArtistBoards,}); // getList가 비동기 함수이므로 처리가 완료될때까지 await으로 기다린다.
        }catch (e){
            console.log(e);
        }finally {
            setImage(null);
            setContent("");
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
            const response = await axios.put(`${ARTIST_BOARD_API_URL}/put`, formData);
            console.log(response.data);
            await getList({
                API_URL: ARTIST_BOARD_API_URL,
                teamuuid: teamUuid,
                setArtistBoards: setArtistBoards}); // 게시물 목록 새로 고침
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
            await getList({
                API_URL: ARTIST_BOARD_API_URL,
                teamuuid: teamUuid,
                setArtistBoards: setArtistBoards,});
        }catch (e) {
        }
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
                        <button className="send-post"
                                onClick={(e)=> {
                                    e.preventDefault();
                                    const newPosting=artistBoardDataForm({
                                        data:null,
                                        content: {content}})
                                    posting(e,newPosting);
                        }}>POST</button>
                    </div>
                    <div className="add-photo">
                        <button className="photo-button"
                                onClick={() => fileInputRef.current.click()}>사진 첨부하기
                        </button>
                        <input type="file"
                               accept="image/*"
                               style={{display: 'none'}} // input 요소 숨기기
                               ref={fileInputRef}
                               onChange={(e)=>handleImageSelect(e, setImage)}/>
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
                                                           onChange={(e)=>handleImageSelect(e,setImage)}/>
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