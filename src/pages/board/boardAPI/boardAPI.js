import axios from "axios";

//read
const getList=async ({API_URL, teamuuid, setArtistBoards})=>{
    try{
        console.log(API_URL)
        const response=await axios.get(`${API_URL}/${teamuuid}`)
        setArtistBoards(response.data);
        console.log(response.data)
    }catch (e) {
        console.log(e);
    }finally {
    }
}

//image
const handleImageSelect = (event, setImage) => {
    const file = event.target.files[0]; // 선택한 파일 가져오기
    if (file) {
        console.log(`선택한 파일: ${file.name}`); // 파일 이름 출력
        setImage(file);
    } else {
        console.log('파일이 선택되지 않았습니다.');
    }
};

//create
// const posting = async (e,postData,API_URL)=>{
//     const formData = new FormData();
//     console.log(JSON.stringify(postData));
//     console.log(`폼 데이터 : ${formData}`)
//     formData.append('image', image);
//     formData.append('post',JSON.stringify(postData));
//     // log formData 내용
//     for (const [key, value] of formData.entries()) {
//         console.log(`${key}: ${value}`);
//     }
//     try {
//         const response = await axios.post(`${API_URL}/board/artistboard`, formData);
//         console.log(response.data);
//         await getList({
//             API_URL: ARTIST_BOARD_API_URL,
//             teamuuid: teamUuid,
//             setArtistBoards: setArtistBoards,}); // getList가 비동기 함수이므로 처리가 완료될때까지 await으로 기다린다.
//     }catch (e){
//         console.log(e);
//     }finally {
//         setImage(null);
//         setContent("");
//     }

export {getList, handleImageSelect};