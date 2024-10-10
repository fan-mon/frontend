import {useEffect, useState} from "react";
import axios from "axios";

const FanBoard = ({ teamUuid }) => {
    const [fanBoards, setFanBoards] = useState([]);
    const [content, setContent] = useState("");
    // const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editcontent, setEditcontent] = useState("");

    useEffect(() => {
        getList();
        // 아티스트 게시물과 다르게 팬 게시물은 빈번하게 등록될 것이 예상되기 때문에
        // 네트워크 요청을 줄이기 위해서 fanBoards 리스트에 추가해서 바로 렌더링 하지만
        // 데이터의 일관성을 위해서 특정 시간마다 DB에서 업데이트 해준다.
        const interval = setInterval(() => {
            getList(); // 일정 시간마다 데이터 가져오기
        }, 3000000); //5분마다 호출한다

        return () => clearInterval(interval);
    }, [teamUuid]);

    const getList=async ()=>{
        try{
            const response=await axios.get(`http://localhost:8080/board/fanboard/${teamUuid}`)
            setFanBoards(response.data);
            console.log(`artist board data : ${fanBoards}`)
        }catch (e) {
            console.log(e);
        }finally {

        }
    }

    const posting = async (e)=>{
        const contentData = {
            fanboarduuid : null,
            content : content,
            createdat : null,
            likecount: null,
            team : {
                teamuuid: teamUuid,
            },
            user : {
                useruuid: localStorage.getItem("uuid"),
            }
        }
        console.log(contentData);

        try {
            const res = await axios.post("http://localhost:8080/board/fanboard",contentData)
            console.log(res.data);
            await getList();
            // setFanBoards((prevItems) => [...prevItems, res.data]);
            setContent("");
        }catch (e) {
            console.log(e)
        }finally {

        }
        // setFanBoards((prevItems) => [...prevItems, contentData]);
        // setContent("");
    }

    return (
        <div className="fanboard-wrap">
            <div className="fanboard-title">FAN BOARD</div>
            <div className="fanboard-body">
                {localStorage.getItem("user") === 'USER' ?
                <div className="new-post-wrap">
                        <textarea className="writing-box" name="" id="" cols="30"
                                  maxLength="150" rows="10" value={content}
                                  onChange={(e) => setContent(e.target.value)}
                                  placeholder="아티스트에게 응원의 한마디! (150자 이내)">
                        </textarea>
                    <div className="send-post" onClick={posting}>
                        post
                    </div>
                </div>
                : null}
                {fanBoards && fanBoards.length > 0 ? (
                    fanBoards.slice().reverse().map((post, index) => (
                            <div key={index} className="fanboard-content-wrap">
                                <div className="content-top">
                                    <div className="user-profile">
                                        <div className="fanmon-img">
                                            icon
                                        </div>
                                        <div className="fanname">
                                            {post.user.name}
                                        </div>
                                    </div>
                                    <div className="date">
                                        {new Date(post.createdat).toLocaleDateString('ko-KR')} {new Date(post.createdat).toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    </div>
                                </div>
                                {editIndex===index ?
                                    (<div>
                                        <textarea className="edit-field"
                                            value={editcontent}
                                            onChange={(e) => setContent(e.target.value)}/>
                                        <button >저장</button>
                                        <button onClick={(e)=> setEditIndex(null)}>취소</button>
                                    </div>)
                                    : (<div className="fanboard-content">
                                        {post.content}
                                    </div>)
                                }
                                {localStorage.getItem("uuid") === post.user.useruuid ?
                                <div className="writer-button">
                                    <button className="edit-button" onClick={(e)=> {
                                        setEditIndex(index);
                                        setEditcontent(post.content);
                                    }}>수정</button>
                                    <button className="delete-button">삭제</button>
                                </div>
                                : null
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