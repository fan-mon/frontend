import {useState,useEffect} from "react";
import axios, {get} from "axios";

const ArtistBoard = ({ teamUuid}) => {
    const [artistBoards, setArtistBoards] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getList();
    }, [teamUuid]);

    const getList=async ()=>{
        try{
            const response=await axios.get(`http://localhost:8080/board/artistboard/${teamUuid}`)
            setArtistBoards(response.data);
            console.log(`artist board data : ${artistBoards}`)
        }catch (e) {
            console.log(e);
        }finally {
        }
    }
    const posting= async (e)=>{
        e.preventDefault();
        console.log(`콘텐츠 내용 : ${content}`)
        // artistuuid,content,createdat,likecount,teamuuid,artistboarduuid
        const postData = {
            artist: {
                artistuuid: localStorage.getItem("uuid"),
            },
            content: content,
            createdat: null,
            likecount: 0,
            team: {
                teamuuid: teamUuid
            },
            artistboarduuid: null,
        }
        console.log(postData);
        try{
            const response = await axios.post("http://localhost:8080/board/artistboard", postData,{
                headers : {
                    'Content-Type' : 'application/json'
                }
            });
        console.log(response.data);
        await getList(); // getList가 비동기 함수이므로 처리가 완료될때까지 await으로 기다린다.
        }catch (e){
            console.log(e);
        }
    }
    return (
        <div className="artist-board-wrap">
            <div className="board-title">
                ARTIST BOARD
            </div>
            { localStorage.getItem("user")==='ARTIST'?
                <div className="new-post-wrap">
                <textarea className="writing-box" name="content"
                          id="content" cols="30" maxLength="150" rows="10"
                          placeholder="150자 이내 작성" value={content}
                          onChange={(e) => setContent(e.target.value)}>
                </textarea>
                <button className="send-post" onClick={posting}>POST</button>
            </div> : null }
            {artistBoards && artistBoards.length > 0 ? (
                artistBoards.map((board, index) => (
                    <div key={index} className="artistboard-content-wrap">
                        {localStorage.getItem("uuid") === board.artistuuid ?
                            <div className="writer-button">
                                <button className="edit-button">수정</button>
                                <button className="delete-button">삭제</button>
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
                                    <div className="content">
                                        <p>{board.content}</p>
                                    </div>
                                    <div className="content-img">
                                        <img src="" alt="content-image"/>
                                    </div>
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