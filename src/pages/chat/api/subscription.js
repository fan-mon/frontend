import axios from "axios";

const getList=async (useruuid, setChatList)=>{
    try{
        const response = await axios.get(`http://localhost:8080/chat/chatlist/${useruuid}`);
        if (response.data===204){
            // setChatList=([]);
        }else {
            console.log(response.data)
            setChatList(response.data)
        }
    }catch (e) {

    }
}

export {getList};