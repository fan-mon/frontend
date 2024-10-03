import { useEffect, useState } from 'react';
import axios from 'axios';
import ArtistBoard from "./ArtistBoard";
import BoardNotice from './BoardNotice';
import FanBoard from './FanBoard';

const BoardPage = ({ teamuuid }) => {
    const [boardData, setBoardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/board/${teamuuid}`);
                console.log(`teamuuid = ${teamuuid}`)
                setBoardData(response.data);
                console.log(response.data)
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [teamuuid]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data: {error.message}</div>;

    return (
        <div style={styles.page}>
            <div style={styles.board}>
                <ArtistBoard artistBoard={boardData.artistboards} />
            </div>
            <div style={styles.notice}>
                <BoardNotice boardNotice={boardData.boardnotices} />
            </div>
            <div style={styles.fanBoard}>
                <FanBoard fanBoard={boardData.fanboards} />
            </div>
        </div>
    );
};

const styles = {
    page: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'space-between',
        alignItems: 'center', // Aligning components in center horizontally
        gap: '20px', // Space between components
    },
    board: {
        width: '80%', // Adjust width to make layout flexible
        padding: '20px',
        backgroundColor: 'rgba(150, 161, 190, 0.1)',
        borderRadius: '10px', // Rounded corners
        border: '1px solid rgba(150, 161, 190, 0.3)',
        boxSizing: 'border-box',
        overflowY: 'scroll',
    },
    notice: {
        width: '80%', // Same width and styling as board
        padding: '20px',
        backgroundColor: 'rgba(150, 161, 190, 0.1)',
        borderRadius: '10px',
        border: '1px solid rgba(150, 161, 190, 0.3)',
        boxSizing: 'border-box',
        overflowY: 'scroll',
    },
    fanBoard: {
        width: '80%', // Same width and styling as board
        padding: '20px',
        backgroundColor: 'rgba(150, 161, 190, 0.1)',
        borderRadius: '10px',
        border: '1px solid rgba(150, 161, 190, 0.3)',
        boxSizing: 'border-box',
        overflowY: 'scroll',
    },
};

export default BoardPage;