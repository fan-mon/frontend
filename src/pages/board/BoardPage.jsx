import { useEffect, useState } from 'react';
import axios from 'axios';
import ArtistBoard from "./ArtistBoard";
import BoardNotice from './BoardNotice';
import FanBoard from './FanBoard';
import TeamProfile from "./TeamProfile";
import './css/board.css';

const BoardPage = ({ teamuuid }) => {
    const [boardData, setBoardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/board/${teamuuid}`);
                console.log(`teamuuid = ${teamuuid}`);
                setBoardData(response.data);
                console.log(response.data);
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
        <div className="whole-page">
            <div className="team-profile">
                <TeamProfile/>
            </div>
            <div className="page">
                    <div className="left-column">
                        <ArtistBoard artistBoard={boardData.artistboards}/>
                    </div>
                    <div className="right-column">
                        <div className="notice">
                            <BoardNotice boardNotice={boardData.boardnotices}/>
                        </div>
                        <hr/>
                        <div className="fan-board">
                            <FanBoard fanBoard={boardData.fanboards}/>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default BoardPage;