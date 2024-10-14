import axios from "axios";
const SUBSCRIPTION_API_URL=`${process.env.REACT_APP_BACKEND_API_URL}/chat`
const getList=async (useruuid, setChatList)=>{
    try{
        const response = await axios.get(`${SUBSCRIPTION_API_URL}/chatlist/${useruuid}`);
        if (response.data===204){
            console.log("구독중인 아티스트 없음")
        }else {
            console.log(response.data)
            setChatList(response.data)
        }
    }catch (e) {
    }
}

//유저가 채팅하는 연예인 정보 가져오기
const getArtistData= async (chatuuid,setChatInfo)=>{
    try{
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/chat/${chatuuid}`)
        console.log(res.data.artist.name)
        setChatInfo(res.data)
    }catch (e){
        console.log(e)
    }
}

export {getList, getArtistData};