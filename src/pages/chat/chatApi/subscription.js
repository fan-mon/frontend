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

export {getList};