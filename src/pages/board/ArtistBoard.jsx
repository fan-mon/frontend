import {href} from "sockjs-client/lib/location";

const ArtistBoard = ({ artistBoard }) => {
    return (

        <div className="artist-board-wrap">
            <div className="board-title">
                Artist Board
            </div>
            <div className="new-post-wrap">
                <textarea className="writing-box" name="" id="" cols="30" maxLength="150" rows="10"
                          placeholder="150자 이내 작성">
                </textarea>
                <button className="send-post" >
                    post
                </button>
            </div>
            {artistBoard && artistBoard.length > 0 ? (
                artistBoard.map((board) => (
                    <div className="artistboard-content-wrap">
                        <div className="writer-button">
                            <button className="edit-button">수정</button>
                            <button className="delete-button">삭제</button>
                        </div>
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