const BoardNotice = ({ boardNotice }) => {
    return (
        <div className="notice-wrap">
            <div className="boardnotice-title">
                NOTICE
            </div>
            {boardNotice && boardNotice.length > 0 ? (
                boardNotice.map((board) => (
                    <div key={board.noticeuuid} className="notice-content-list">
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