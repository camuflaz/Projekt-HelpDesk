import { useEffect, useRef, useState } from "react";
import "./TicketDrawer.css";
import API_URL from "../../services/api";
import ChatInput from "../Chat/ChatInput";
import ChatMessage from "../Chat/ChatMessage"
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";

function TicketDrawer({ ticketId, onClose }){
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);

    const statusTranslations = {
            "new" : "Nowe",
            "in-progress" : "W realizacji",
            "resolved" : "Rozwiązane",
            "closed" : "Zamknięte"
        }

    const priorityTranslations = {
            "low" : "Niski",
            "medium" : "Średni",
            "high" : "Wysoki",
            "critical" : "Krytyczny"
        }

    const chatRef = useRef();

    useEffect(() => {
        if(chatRef.current){
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    },[ticket]);

    useEffect(() => {
        if(ticketId == null)
        {
            setTicket(null);
            return;
        }

        loadTicket();
    }, [ticketId]);

     useEffect(() => {
        function handleKey(e){
            if(e.key === "Escape")
                onClose();
        }

        window.addEventListener("keydown", handleKey);

        return () =>{
            window.removeEventListener("keydown", handleKey);
        }
    },[]);

    async function loadTicket(){
        setLoading(true);
        try{
            const response = await fetch(`${API_URL}/tickets/${ticketId}`,
            {
                credentials: "include"
            }
            );

            if (response.ok){
                const data = await response.json();
                setTicket(data);
            }

        }

        finally{
            setLoading(false);
        }
    }

        if(ticketId == null){
            return null;
        }

        return(
            <AnimatePresence>
            {ticketId &&(
            <>
            <motion.div 
            className="drawer-overlay" 
            onClick={onClose}
            initial={{opacity: 0 }}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.25}}
            />
            
            
            <motion.div 
                        className="drawer"
                        initial={{ x: "110%" }}
                        animate={{ x: 0 }}    
                        exit={{ x: "110%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                <div className="drawer-header">
                    <h2>Szczegóły zgłoszenia</h2>
                    <button onClick={onClose}> <CgClose /> </button>
                </div>
                {
                    loading ?
                    <p>Ładowanie...</p>
                    :
                    ticket &&
                    <>
                    <div className="drawer-section">
                        <h3>{ticket.title}</h3>
                    </div>

                    <div className="drawer-grid">

                        <div>
                            <label>Status</label>
                            <span className={"drawer-"+ticket.status}>{statusTranslations[ticket.status]}</span>
                        </div>

                        <div>
                            <label>Priorytet</label>
                            <span className={"drawer-"+ticket.priority}>{priorityTranslations[ticket.priority]}</span>
                        </div>

                        <div>
                            <label>Kategoria</label>
                            <span>{ticket.category}</span>
                        </div>

                    </div>

                    <div className="drawer-section">

                        <h4>Opis</h4>

                        <p>{ticket.description}</p>
                    </div>

                    <div className="drawer-section">
                        <h4>Rozmowa</h4>
                        <div className="chat-container" ref={chatRef}>

                        {
                            ticket.comments.length === 0?
                            <p>Brak wiadomości</p>

                            :

                            ticket.comments.map(comment=> (
                                <ChatMessage key={comment.id}
                                message={comment}
                                currentUserId={ticket.currentUserId}
                                    />
                            )
                            )   
                                
                        }
                        </div>

                    </div>

                    <ChatInput ticketId={ticket.id}
                    onSend={loadTicket} />

                    </>
                }
            </motion.div>
            </>
            )}
            </AnimatePresence>
        );
    }
export default TicketDrawer;