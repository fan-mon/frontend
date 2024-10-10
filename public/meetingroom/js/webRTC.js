import { io } from 'socket.io-client';

function addEventWhenReady(selector, event, handler) {
    const intervalId = setInterval(() => {
        const element = document.querySelector(selector);
        if (element !== null) {
        element.addEventListener(event, handler);
        clearInterval(intervalId);
        }
    }, 100);
}
window.addEventListener("load", function(){
    const socket = io("http://localhost:3030");
    
    let myStream;
    let muted = false;
    let cameraOff = false;
    let roomName = "20241007_aritistId";
    let myPeerConnection;
    let myDataChannel;

    async function getCameras(){
        try{
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter(device => device.kind === "videoinput");
            const currentCamera = myStream.getVideoTracks()[0];
            cameras.forEach(camera=>{
                const option = document.createElement("option");
                option.value = camera.deviceId;
                option.innerText = camera.label;
                if(currentCamera.label === camera.lable){
                    option.selected = true;
                }
                document.getElementById("selCamera").appendChild(option);
            })
        }catch(error){
            console.log(error)
        }
    }

    async function getMedia(deviceId){
        const initalConstrains = {
            audio:true, 
            video: {facingMode: "user"}
        };
        const cameraConstraints = {
            audio:true,
            video : {deviceId: {exact: deviceId}},
        };
        try {
            myStream = await navigator.mediaDevices.getUserMedia(
                deviceId ? cameraConstraints : initalConstrains
            );
            console.log(myStream);
            document.getElementById("myFaceVideo").srcObject = myStream;
            if(!deviceId){
                await getCameras();
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    //getMedia();

    function handleMuteClick(){
        myStream.getAudioTracks().forEach(track=>{
            track.enabled = !track.enabled
        });
        if(!muted){
            muted = true;
        }else{
            muted = false;
        }
    }
    function handleCameraClick(){
        myStream.getVideoTracks().forEach(track=>{
            track.enabled = !track.enabled
        });
        if(cameraOff){
            cameraOff = false;
        }else{
            cameraOff = true;
        }
    }
    async function handleCameraChange(){
        await getMedia(document.getElementById("selCamera").value);
        if(myPeerConnection){
            const videoTrack = myStream.getVideoTracks()[0];
            const videoSender = myPeerConnection.getSenders().find(sender => sender.track.kind === "video");
            videoSender.replaceTrack(videoTrack);
            console.log(videoSender);
        }
    }

    
    addEventWhenReady("#btnControlCamera", "click", handleCameraClick);
    addEventWhenReady("#selCamera", "click", handleCameraChange);

    //Welcome Form(choose a room)
    async function initCall(){
        await getMedia();
        makeConnection();
    }


    //가장 처음 실행
    handleWelcomeSubmuit();
    async function handleWelcomeSubmuit(e){
        await initCall();
        socket.emit("join_room", roomName, initCall);
    }
    

    //Socket Code
    socket.on("welcome", async()=>{
        const offer = await myPeerConnection.createOffer();
        console.log("Generated Offer:", offer); // 로그 추가
        myPeerConnection.setLocalDescription(offer);
        console.log("send the offer");
        socket.emit("offer", offer, roomName);
    })

    socket.on("offer", async(offer) => {
        myPeerConnection.addEventListener("datachannel", e =>{
            myDataChannel = e.channel;
            myDataChannel.addEventListener("msg", console.log);
        });
        console.log("received the offer");
        myPeerConnection.setRemoteDescription(offer);
        const answer = await myPeerConnection.createAnswer();
        myPeerConnection.setLocalDescription(answer);
        socket.emit("answer", answer, roomName);
        console.log("send the answer");
    });

    socket.on("answer", answer=>{
        console.log("received the answer");
        myPeerConnection.setRemoteDescription(answer);
    });

    socket.on("ice", ice=>{
        console.log("received candidate");
        myPeerConnection.addIceCandidate(ice);
    });

    //RTC Code
    function makeConnection(){
        myPeerConnection = new RTCPeerConnection({
            iceServers: [{
                urls: [ "stun:ntk-turn-2.xirsys.com" ]
            }, {
            username: "-RpPgejvJECxBYUH8sLdmRbeDiq8thSHLjOU1ctw2OKXyne4POCi9yNUmHBadEZ3AAAAAGcCPOFjaGxhaGZv",
            credential: "09fde80e-83b5-11ef-92bd-0242ac120004",
            urls: [
                "turn:ntk-turn-2.xirsys.com:80?transport=udp",
                "turn:ntk-turn-2.xirsys.com:3478?transport=udp",
                "turn:ntk-turn-2.xirsys.com:80?transport=tcp",
                "turn:ntk-turn-2.xirsys.com:3478?transport=tcp",
                "turns:ntk-turn-2.xirsys.com:443?transport=tcp",
                "turns:ntk-turn-2.xirsys.com:5349?transport=tcp"
            ]
            }]
        });
        myPeerConnection.addEventListener("icecandidate", handleIce);
        myPeerConnection.addEventListener("addstream", handleAddStream);
        myStream.getTracks().forEach(track=> myPeerConnection.addTrack(track, myStream));
    }

    function handleIce(data){
        console.log("send candidate");
        socket.emit("ice", data.candidate, roomName)
    }

    function handleAddStream(data){
        document.getElementById("peerFaceVideo").srcObject = data.stream;
        console.log("Peer\'s Stream",data.stream);
    }
});