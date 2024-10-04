const FanBoard = ({ fanBoard }) => {
    return (
        <div style={styles.container}>
            <h2>Fan Board</h2>
            <pre>{JSON.stringify(fanBoard, null, 2)}</pre>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        boxSizing: 'border-box',
    },
};

export default FanBoard;