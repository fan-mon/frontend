const BoardNotice = ({ boardNotice }) => {
    return (
        <div style={styles.container}>
            <h2>Board Notices</h2>
            <pre>{JSON.stringify(boardNotice, null, 2)}</pre>
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