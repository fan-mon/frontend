import React, { useEffect, useState } from 'react';
import "./css/teamdetail.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

function TeamDetail() {
    const managementuuid = '32eb55e2-022c-4741-8a41-d32916480b4e'; //hard coding
    // const { managementuuid: urlmanagementuuid} = useParams(); //url에서 managementuuid 가져오기
    // const managementuuid = urlmanagementuuid || localStorage.getItem('managementuuid'); //세션 저장소에서 가져오기
    const { teamuuid } = useParams();

    
}
export default TeamDetail;