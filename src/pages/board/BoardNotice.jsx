import {useEffect, useState} from "react";
import axios from "axios";

const BoardNotice = ({ teamUuid }) => {
    const [boardNotices, setBoardNotices] = useState([]);
    useEffect(() => {
        getList();
    }, [teamUuid]);

    const getList=async ()=>{
        try{
            const response=await axios.get(`http://localhost:8080/board/boardnotice/${teamUuid}`)
            setBoardNotices(response.data);
            console.log(`artist board data : ${boardNotices}`)
        }catch (e) {
            console.log(e);
        }
    }
    return (
        <div className="notice-wrap">
            <div className="boardnotice-title">
                NOTICE
            </div>
            {boardNotices && boardNotices.length > 0 ? (
                boardNotices.map((board,index) => (
                    <div key={index} className="notice-content-list">
                        <div className="notice-title"> {board.title}</div>
                        <div className="date">
                            {new Date(board.createdat).toLocaleDateString('ko-KR')} {new Date(board.createdat).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        </div>
                    </div>
                ))
            ) : (
                <p>No notice available.</p>
            )}
        </div>
    );
};

export default BoardNotice;