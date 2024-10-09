import {useEffect, useState} from "react";
import axios from "axios";

const FanBoard = ({ teamUuid }) => {

    const [fanBoards, setFanBoards] = useState([]);
    useEffect(() => {
        getList();
    }, [teamUuid]);

    const getList=async ()=>{
        try{
            const response=await axios.get(`http://localhost:8080/board/fanboard/${teamUuid}`)
            setFanBoards(response.data);
            console.log(`artist board data : ${fanBoards}`)
        }catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="fanboard-wrap">
            <div className="fanboard-title">FAN BOARD</div>
            <div className="fanboard-body">
                {localStorage.getItem("user")==='USER'?
                    <div className="new-post-wrap">
                    <textarea className="writing-box" name="" id="" cols="30" maxLength="150" rows="10"
                              placeholder="아티스트에게 응원의 한마디! (150자 이내)">
                    </textarea>
                    <div className="send-post">
                        post
                    </div>
                </div> : null }
                {fanBoards && fanBoards.length > 0 ? (
                    fanBoards.map((post, index) => (
                            <div key={index} className="fanboard-content-wrap">
                                <div className="content-top">
                                    <div className="fanname">
                                        {post.user.name}
                                    </div>
                                    <div className="date">
                                        {new Date(post.createdat).toLocaleDateString('ko-KR')} {new Date(post.createdat).toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    </div>
                                </div>
                                <div className="fanboard-content">
                                    {post.content}
                                </div>
                                {localStorage.getItem("uuid") === post.useruuid ?
                                    <div className="writer-button">
                                        <button className="edit-button">수정</button>
                                        <button className="delete-button">삭제</button>
                                    </div> : null
                                }
                            </div>
                        )
                    )) : (
                    <p></p>
                )}
            </div>
        </div>
    );
}

export default FanBoard;