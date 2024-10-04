import {useState} from "react";

const UserChat = ({ messages, sendMessage}) => {
    console.log("Received messages: ", messages);
    const [inputMessage, setInputMessage] = useState('');
    const handleSendMessage = () => {
        sendMessage(inputMessage, 'USER');
        setInputMessage('');
    };
    return (
        <div>
            <h2>User Component</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.messageFrom === 'ARTIST' ? 'Artist' : 'User'}: </strong> {msg.messagetext}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Enter message"
            />
            <button onClick={handleSendMessage}>Send Message</button>
        </div>
    );
};

export default UserChat;