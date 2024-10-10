const cors = require("cors");               // import를 require로 변경
const express = require("express");         // import를 require로 변경
const http = require("http");               // import를 require로 변경
const SocketIO = require("socket.io");      // import를 require로 변경

const app = express();

app.use(cors({
    origin: true, // React 앱의 주소
    methods: ['GET', 'POST'], // 허용할 HTTP 메소드
    allowedHeaders: ["Content-Type"],
    credentials: true // 쿠키 및 인증 정보를 포함한 요청 허용
}));

app.get("/", (req, res) => {
    res.send('<h1>Socket.IO Server Running</h1>'); // 간단한 HTML 응답
});

//app.set("view engine", "pug");
//app.set("views", __dirname+"/views");
//app.use("/public", express.static(__dirname+"/public"));
//app.get("/", (req, res)=> res.render("home"));
//app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
//const wsServer = SocketIO(httpServer);
// Socket.IO 서버 생성 및 CORS 설정
const wsServer = SocketIO(httpServer, {
    cors: {
        origin: true, // React 앱의 주소
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true // 쿠키 및 인증 정보를 포함한 요청 허용
    }
});

wsServer.on("connection", socket=>{
    socket.on("join_room", (roomName, done) => {
        console.log("서버 Peer 1이 접속함.", roomName);
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName)=>{
        console.log(roomName, " 서버로그 offer", offer.type);
        socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName)=>{
        console.log(roomName, " 서버로그 answer", answer.type);
        socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName)=>{
        console.log(roomName, " 서버로그 ice", ice);
        socket.to(roomName).emit("ice", ice);
    })
    
});

const handleListen = () => console.log("Listening on http://localhost:3030");
httpServer.listen(3030, handleListen);