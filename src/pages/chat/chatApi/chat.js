import axios from "axios";
const CHAT_API_URI=`${process.env.REACT_APP_BACKEND_API_URL}/chat`
const getMessageList = async (chatuuid)=>{
    try{
        const response = await axios.get(`${CHAT_API_URI}/messages/${chatuuid}`);
        return response.data
    }catch (e){
        console.log(e)
    }
}

const getChatInfo = async(chatuuid)=>{
    try{
        const response = await axios.get(`${CHAT_API_URI}/${chatuuid}`)
        return response.data
    }catch (e){
        console.log(e)
    }
}

// 유저 밴 함수
const blockuser= async (useruuid)=>{
    try {
        const response=await axios.post(`${CHAT_API_URI}/block`, null, {
            params: {uuid: useruuid},
        });
        const banneduuid=response.data;
        if (banneduuid===useruuid){
            alert("해당 유저를 차단했습니다.")
        }
    }catch (e){
        console.log(e)
    }
}

// 이미지 전송 함수
const sendImage = (image, sendMessage) => {
    const formData = new FormData();
    formData.append("image", image);

    axios.post(`${CHAT_API_URI}sendImage`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // 멀티파트 폼 데이터로 전송
        },
    })
        .then(response => {
            const imageUrl = response.data; // 서버에서 받은 이미지 URL
            sendMessage(imageUrl); // 이미지 URL로 채팅 메시지 전송
        })
        .catch(error => {
            console.error('Error sending image:', error);
        });
};


export {getMessageList, getChatInfo,blockuser};