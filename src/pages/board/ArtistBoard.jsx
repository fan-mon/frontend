const ArtistBoard = ({ artistBoard }) => {
    return (
        <div style={styles.container}>
            <h1>Artist Board</h1>
            <pre>{JSON.stringify(artistBoard, null, 2)}</pre>
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