const BoardNotice = ({ boardNotice }) => {
    return (
        <div style={styles.container}>
            <h2>Board Notices</h2>
            {boardNotice && boardNotice.length>0?(
                boardNotice.map((board)=>(
                    <div key={board.noticeuuid}>
                        <h2>{board.team.name} 관련 공지</h2>
                        <p>title : {board.title}</p>
                        <p>created at : {board.createdat}</p>
                        <p>content : {board.content} </p>
                    </div>
                ))
            ) : (
                <p>No notice available.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        boxSizing: 'border-box',
    },
};

export default BoardNotice;