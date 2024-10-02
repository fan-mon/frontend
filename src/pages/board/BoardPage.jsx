import { useEffect, useState } from 'react';
import axios from 'axios';
import ArtistBoard from "./ArtistBoard";
import BoardNotice from './BoardNotice';
import FanBoard from './FanBoard';

const BoardPage = ({ artistUuid }) => {
    const [boardData, setBoardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/board/${artistUuid}`);
                setBoardData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [artistUuid]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data: {error.message}</div>;

    return (
        <div style={styles.page}>
            <div style={styles.board}>
                <ArtistBoard artistBoard={boardData.artistBoard} />
            </div>
            <div style={styles.notice}>
                <BoardNotice boardNotice={boardData.boardNotice} />
            </div>
            <div style={styles.fanBoard}>
                <FanBoard fanBoard={boardData.fanBoard} />
            </div>
        </div>
    );
};

const styles = {
    page: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    board: {
        width: '50%',
        height: '100%',
        overflowY: 'scroll',
    },
    notice: {
        width: '50%',
        height: '50%',
        overflowY: 'scroll',
    },
    fanBoard: {
        width: '50%',
        height: '50%',
        overflowY: 'scroll',
    },
};

export default BoardPage;