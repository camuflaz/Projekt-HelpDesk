import { useEffect, useRef, useState } from "react";
import "./TicketDrawer.css";
import API_URL from "../../services/api";
import ChatInput from "../Chat/ChatInput";
import ChatMessage from "../Chat/ChatMessage"
import { motion, AnimatePresence } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { useAuth } from "../../context/AuthContext";
import { CgCheckR } from "react-icons/cg"; 
import { CgCloseR } from "react-icons/cg";
import { notifyTicketRefresh } from "../../services/ticketRefresh";
import { CgPinAlt } from "react-icons/cg";

function TicketDrawer({ ticketId, onClose, isActiveView = false }){
    const { user } = useAuth();
    const [status, setStatus] = useState(null);
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);

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

    async function handleAssignTicket(ticketId, adminId) {
        const response = await fetch(`${API_URL}/tickets/${ticketId}/assign`, {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            setTicket(prevTicket =>
                prevTicket
                    ? { ...prevTicket, assignedAdminId: adminId, status: "in-progress" }
                    : prevTicket
            );
            notifyTicketRefresh();
            await loadTicket();
        }
    }

    async function updateTicketStatus(nextStatus){
        if(!ticketId || statusUpdating){
            return;
        }

        setStatusUpdating(true);

        try{
            const response = await fetch(`${API_URL}/tickets/${ticketId}/status`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: nextStatus, comment: "" })
            });

            if(response.ok){
                notifyTicketRefresh();
                await loadTicket();
            }
        }
        finally{
            setStatusUpdating(false);
        }
    }

        if(ticketId == null){
            return null;
        }


        if(user.role === "user"){
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
                        <motion.button className="button-close"
                        whileHover={{ y: -4, scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        onClick={onClose}> 
                        <CgClose /> 
                        </motion.button>
                    </div>
                    {
                        loading ?
                        <p className="drawer-loading">Ładowanie...</p>
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

                            <p className="drawer-section-description">{ticket.description}</p>
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
    if(user.role === "admin"){
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
                        <div className="drawer-header-buttons">
                            {isActiveView && ticket && ticket.status === "new" && (
                            <motion.button
                                className="button-pin-me"
                                whileHover={{ y: -4, scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const confirmed = window.confirm("Czy na pewno chcesz przypiąć zgłoszenie do siebie?");
                                    if (confirmed) {
                                        handleAssignTicket(ticket.id, user.id);
                                    }
                                }}
                            >
                                <CgPinAlt />
                            </motion.button>
                            )}
                        {isActiveView && ticket && ticket.status === "in-progress" && (
                            <>
                                <motion.button className="button-status-resolved" type="button" 
                                whileHover={{ y: -4, scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const confirmed = window.confirm("Czy chcesz zmienić status zgłoszenia na Rozwiązane?");
                                    if (confirmed) {
                                        updateTicketStatus("resolved");
                                    }
                                }} disabled={statusUpdating}> <CgCheckR /> </motion.button>

                                <motion.button className="button-status-closed" type="button" 
                                whileHover={{ y: -4, scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const confirmed = window.confirm("Czy chcesz zmienić status zgłoszenia na Zamknięte?");
                                    if (confirmed) {
                                        updateTicketStatus("closed");
                                    }
                                }} disabled={statusUpdating}> <CgCloseR /> </motion.button>
                            </>
                        )}
                        <motion.button
                            className="button-close"
                            whileHover={{ y: -4, scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            onClick={onClose}
                        >
                            <CgClose />
                        </motion.button>
                        </div>
                    </div>
                    {
                        loading ?
                        <p className="drawer-loading">Ładowanie...</p>
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

                            <p className="drawer-section-description">{ticket.description}</p>
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
    }
export default TicketDrawer;