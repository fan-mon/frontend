const ArtistBoard = ({ artistBoard }) => {
    return (
        <div style={styles.container}>
            <h1>Artist Board</h1>
            {artistBoard && artistBoard.length > 0 ? (
                artistBoard.map((board) => (
                    <div key={board.artistboarduuid} style={styles.boardItem}>
                        <h2>{board.artist.name}</h2>
                        <p>Content: {board.content}</p>
                        <p>Like Count: {board.likecount}</p>
                        <p>Team: {board.team.name}</p>
                        <p>Debut: {board.team.debut}</p>
                        <p>Description: {board.team.description}</p>
                    </div>
                ))
            ) : (
                <p>No artist boards available.</p>
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

export default ArtistBoard;