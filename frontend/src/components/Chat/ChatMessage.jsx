import "./Chat.css";

function ChatMessage({ message, currentUserId }){
    const ownMessage = message.userId === currentUserId;

    return (
        <div className={ownMessage ?  "message own" : "message other"}>
            <div className="message-author">
                {ownMessage ? "Ty" : message.role === "admin" ? "Admin" : "Użytkownik"}
            </div>

            <div className="message-body">
                {message.message}
            </div>
            
            <div className="message-date">
                {new Date(message.createdAt).toLocaleString("pl-PL")}
            </div>
        </div>

    );
}
export default ChatMessage;
