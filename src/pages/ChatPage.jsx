import {useEffect, useState} from "react";

const ChatPage= ()=>{
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/chat")
            .then((response) => response.json())
            .then((json) => setMessage(json.SUCCESS_TEXT));
    }, []);
    return (
        <div>
            <h1>Chat Page</h1>
            <p>{message}</p> {/* message를 화면에 표시 */}
        </div>
    );
}

export default ChatPage;