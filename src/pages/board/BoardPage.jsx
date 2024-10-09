import { useEffect, useState } from 'react';
import axios from 'axios';
import ArtistBoard from "./ArtistBoard";
import BoardNotice from './BoardNotice';
import FanBoard from './FanBoard';
import TeamProfile from "./TeamProfile";
import './css/board.css';

const BoardPage = ({ teamuuid }) => {

    return (
        <div className="whole-page">
            <div className="team-profile">
                <TeamProfile teamuuid={teamuuid}/>
            </div>
            <div className="page">
                    <div className="left-column">
                        <ArtistBoard
                            teamUuid={teamuuid}/>
                    </div>
                    <div className="right-column">
                        <div className="notice">
                            <BoardNotice
                                teamUuid={teamuuid}/>
                        </div>
                        <hr/>
                        <div className="fan-board">
                            <FanBoard
                                teamUuid={teamuuid}/>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default BoardPage;