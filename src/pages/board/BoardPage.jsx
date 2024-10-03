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
            <div style={styles.leftColumn}>
                <ArtistBoard artistBoard={boardData.artistboards}/>
            </div>
            <div style={styles.rightColumn}>
                <div style={styles.notice}>
                    <BoardNotice boardNotice={boardData.boardnotices}/>
                </div>
                <div style={styles.fanBoard}>
                    <FanBoard fanBoard={boardData.fanboards}/>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        display: 'flex',
        height: '100vh',
        padding: '20px',
        gap: '30px'
    },
    leftColumn: {
        flex: 1, // Takes up one part of the available space (left side)
        marginRight: '20px',
        padding: '20px',
        backgroundColor: 'rgba(150, 161, 190, 0.1)',
        borderRadius: '10px',
        border: '1px solid rgba(150, 161, 190, 0.3)',
        boxSizing: 'border-box',
        overflowY: 'scroll',
    },
    rightColumn: {
        flex: 1, // Takes up one part of the available space (right side)
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    notice: {
        flex: 1,
        padding: '20px',
        marginBottom: '20px', // Space between notice and fan board
        backgroundColor: 'rgba(150, 161, 190, 0.1)',
        borderRadius: '10px',
        border: '1px solid rgba(150, 161, 190, 0.3)',
        boxSizing: 'border-box',
        overflowY: 'scroll',
    },
    fanBoard: {
        flex: 1,
        padding: '20px',
        backgroundColor: 'rgba(150, 161, 190, 0.1)',
        borderRadius: '10px',
        border: '1px solid rgba(150, 161, 190, 0.3)',
        boxSizing: 'border-box',
        overflowY: 'scroll',
    },
};

export default BoardPage;