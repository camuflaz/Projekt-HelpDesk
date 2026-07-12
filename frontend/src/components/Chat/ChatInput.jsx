import { useState } from "react";
import API_URL from "../../services/api";
import { CgChevronRightO } from "react-icons/cg";

function ChatInput({ ticketId, onSend }){
    const [message, setMessage] = useState("");

    async function send(e) {
        e.preventDefault();

        if(message.trim() === ""){
            return;
        }

        const response = await fetch(
            `${API_URL}/tickets/${ticketId}/comments`,
            {
                method : "POST",
                credentials : "include",
                headers : {"Content-Type" : "application/json"}
            ,

            body : JSON.stringify({
                message
            })
        }

        );

        if(response.ok){
            setMessage("");
            onSend();
        }
    }
    return(
        <form className="chat-input" onSubmit={send}>
            <textarea 
            rows="3" 
            placeholder="Napisz wiadomość..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            />

            <button className="chat-input-button">
                <CgChevronRightO />
            </button>
            

            
        </form>
    );
}
export default ChatInput;