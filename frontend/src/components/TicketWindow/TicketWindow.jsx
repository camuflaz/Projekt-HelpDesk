import { useEffect, useRef, useState } from "react";
import "./TicketWindow.css";
import API_URL from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { notifyTicketRefresh } from "../../services/ticketRefresh";
import { CgClose, CgCloseR, CgCheckR, CgChevronRightO, CgPinAlt } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "../Chat/ChatMessage";

function TicketWindow({ ticketId, onClose }) {
    const { user } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [message, setMessage] = useState("");
    const [internalMessage, setInternalMessage] = useState("");
    const [internalNotes, setInternalNotes] = useState([]);
    const [activeTab, setActiveTab] = useState("chat");
    const chatRef = useRef(null);

    const statusTranslations = {
        new: "Nowe",
        "in-progress": "W realizacji",
        resolved: "Rozwiązane",
        closed: "Zamknięte"
    };

    const priorityTranslations = {
        low: "Niski",
        medium: "Średni",
        high: "Wysoki",
        critical: "Krytyczny"
    };

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [ticket, activeTab]);

    useEffect(() => {
        if (ticketId == null) {
            setTicket(null);
            return;
        }

        loadTicket();
    }, [ticketId]);

    useEffect(() => {
        function handleKey(e) {
            if (e.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    }, [onClose]);

    async function loadTicket() {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                setTicket(data);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleAssignTicket() {
        if (!ticket) {
            return;
        }

        const response = await fetch(`${API_URL}/tickets/${ticket.id}/assign`, {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            setTicket(prevTicket =>
                prevTicket
                    ? { ...prevTicket, assignedAdminId: user.id, status: "in-progress" }
                    : prevTicket
            );
            notifyTicketRefresh();
            await loadTicket();
        }
    }

    async function updateTicketStatus(nextStatus) {
        if (!ticketId || statusUpdating) {
            return;
        }

        setStatusUpdating(true);

        try {
            const response = await fetch(`${API_URL}/tickets/${ticketId}/status`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: nextStatus, comment: "" })
            });

            if (response.ok) {
                notifyTicketRefresh();
                await loadTicket();
            }
        } finally {
            setStatusUpdating(false);
        }
    }

    async function handleSendPublicMessage(e) {
        e.preventDefault();

        if (!message.trim() || !ticket) {
            return;
        }

        const response = await fetch(`${API_URL}/tickets/${ticket.id}/comments`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message.trim() })
        });

        if (response.ok) {
            setMessage("");
            await loadTicket();
        }
    }

    function handleSaveInternalNote(e) {
        e.preventDefault();

        if (!internalMessage.trim()) {
            return;
        }

        setInternalNotes(prev => [
            {
                id: Date.now(),
                message: internalMessage.trim(),
                createdAt: new Date().toISOString()
            },
            ...prev
        ]);
        setInternalMessage("");
    }

    if (ticketId == null) {
        return null;
    }

    const isAdmin = user?.role === "admin";
    const isAssigned = ticket?.assignedAdminId != null;
    const currentStatus = ticket?.status ?? "new";
    const timelineSteps = 
        ticket?.status === "closed"
            ? [
                { key: "new", label: "Nowe" },
                { key: "in-progress", label: "W realizacji" },
                { key: "closed", label: "Zamknięte" }
            ]
            : [
                { key: "new", label: "Nowe" },
                { key: "in-progress", label: "W realizacji" },
                { key: "resolved", label: "Rozwiązane" }
            ];

    const getTimelineDotClassName = (stepKey, isCurrent, isCompleted) => {
        const stateClass = isCurrent ? "current" : isCompleted ? "done" : "pending";
        const statusClass = isCurrent || isCompleted ? stepKey : "";

        return ["timeline-dot", stateClass, statusClass].filter(Boolean).join(" ");
    };

    const getTimelineLineClassName = (isCompleted) => (isCompleted ? "timeline-line done" : "timeline-line pending");
    
    const formatTicketDate = (value) => {
        if (!value) {
            return "brak danych";
        }

        return new Date(value).toLocaleString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };
    const lastUpdateText = formatTicketDate(ticket?.updatedAt);

    return (
        <AnimatePresence>
            {ticketId && (
                <>
                    <motion.div
                        className="ticket-window-overlay"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                    />

                    <motion.div
                        className="ticket-window-panel"
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", stiffness: 180, damping: 24 }}>
                    
                        <div className="ticket-window-header">
                            <div>
                                <div className="ticket-window-title-row">
                                    <h2>{loading ? "Ładowanie..." : ticket?.title ?? "Szczegóły zgłoszenia"}</h2>
                                    <span className={`ticket-window-status-pill ${currentStatus}`}>
                                        {statusTranslations[currentStatus] ?? "Nowe"}
                                    </span>
                                </div>
                                <p className="ticket-window-subtitle">
                                    {ticket ? `Utworzone ${new Date(ticket.createdAt).toLocaleString("pl-PL")}` : "Wczytywanie danych..."}
                                </p>
                            </div>

                            <div className="ticket-window-actions">
                                {isAdmin && ticket && ticket.status === "new" && (
                                    <motion.button
                                        type="button"
                                        className="ticket-window-action-btn pin"
                                        whileHover={{ y: -2, scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const confirmed = window.confirm("Czy na pewno chcesz przypiąć zgłoszenie do siebie?");
                                            if (confirmed) {
                                                handleAssignTicket();
                                            }
                                        }}
                                    >
                                        <CgPinAlt />
                                    </motion.button>
                                )}

                                {isAdmin && ticket && ticket.status === "in-progress" && (
                                    <>
                                        <button
                                            type="button"
                                            className="ticket-window-action-btn resolve"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const confirmed = window.confirm("Czy chcesz zmienić status zgłoszenia na Rozwiązane?");
                                                if (confirmed) {
                                                    updateTicketStatus("resolved");
                                                }
                                            }}
                                            disabled={statusUpdating}
                                        >
                                            <CgCheckR />
                                        </button>

                                        <button
                                            type="button"
                                            className="ticket-window-action-btn close"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const confirmed = window.confirm("Czy chcesz zmienić status zgłoszenia na Zamknięte?");
                                                if (confirmed) {
                                                    updateTicketStatus("closed");
                                                }
                                            }}
                                            disabled={statusUpdating}
                                        >
                                            <CgCloseR />
                                        </button>
                                    </>
                                )}

                                <button type="button" className="ticket-window-action-btn close-main" onClick={onClose}>
                                    <CgClose />
                                </button>
                            </div>
                        </div>

                        <div className="ticket-window-content">
                            <div className="ticket-window-timeline-card full-width">
                                <div className="ticket-window-timeline-header">
                                    <h3>Przebieg zgłoszenia</h3>
                                    <span> • Zaktualizowano {lastUpdateText} </span>
                                </div>
                                <div className="ticket-window-timeline">
                                    {timelineSteps.map((step, index) => {
                                        const currentIndex = timelineSteps.findIndex(x => x.key === currentStatus);

                                        const isCompleted = index < currentIndex;
                                        const isCurrent = index === currentIndex;
                                        const dotClassName = getTimelineDotClassName(step.key, isCurrent, isCompleted);
                                        const lineClassName = getTimelineLineClassName(isCompleted);

                                        return (
                                            <div key={step.key} className="timeline-item">
                                                <div className={dotClassName} />

                                                <span>{step.label}</span>

                                                {index < timelineSteps.length - 1 && <div className={lineClassName} />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="ticket-window-main-grid">
                                <div className="ticket-window-left-column">
                                    <div className="ticket-window-summary-card">
                                        <h3>Najważniejsze informacje</h3>
                                        <div className="ticket-window-summary-list">
                                            <div>
                                                <label>Tagi</label>
                                                <span>{ticket?.tags ?? "-"}</span>
                                            </div>
                                            <div>
                                                <label>Priorytet</label>
                                                <span>{priorityTranslations[ticket?.priority] ?? "-"}</span>
                                            </div>
                                            <div>
                                                <label>Kategoria</label>
                                                <span>{ticket?.category ?? "-"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ticket-window-summary-card secondary">
                                        <h3>Opis</h3>
                                        <p>
                                            {ticket?.description
                                                ? ticket.description
                                                : "Brak opisu zgłoszenia. Użytkownik może uzupełnić szczegóły w kolejnym kroku."}
                                        </p>
                                    </div>
                                </div>

                                <div className="ticket-window-right-column">
                                    <div className="ticket-window-card ticket-window-chat-card">
                                        <div className="ticket-window-card-header">
                                            <h3>Komunikacja</h3>
                                            <div className="ticket-window-tabs">
                                                <button
                                                    type="button"
                                                    className={activeTab === "chat" ? "active" : ""}
                                                    onClick={() => setActiveTab("chat")}
                                                >
                                                    Rozmowa z użytkownikiem
                                                </button>
                                                {isAdmin && (
                                                    <button
                                                        type="button"
                                                        className={activeTab === "internal" ? "active" : ""}
                                                        onClick={() => setActiveTab("internal")}
                                                    >
                                                        Notatka wewnętrzna
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="ticket-window-chat-messages" ref={chatRef}>
                                            {activeTab === "chat" ? (
                                                ticket?.comments?.length ? (
                                                    ticket.comments.map(comment => (
                                                        <ChatMessage key={comment.id} message={comment} currentUserId={ticket.currentUserId} />
                                                    ))
                                                ) : (
                                                    <p className="ticket-window-empty">Brak wiadomości w tej rozmowie.</p>
                                                )
                                            ) : (
                                                internalNotes.length ? (
                                                    internalNotes.map(note => (
                                                        <div key={note.id} className="ticket-window-internal-note">
                                                            <strong>{new Date(note.createdAt).toLocaleString("pl-PL")}</strong>
                                                            <p>{note.message}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="ticket-window-empty">Brak notatek wewnętrznych.</p>
                                                )
                                            )}
                                        </div>

                                        <form className="ticket-window-composer" onSubmit={activeTab === "chat" ? handleSendPublicMessage : handleSaveInternalNote}>
                                            <textarea
                                                rows="3"
                                                placeholder={activeTab === "chat" ? "Napisz wiadomość do użytkownika..." : "Dodaj notatkę dla zespołu..."}
                                                value={activeTab === "chat" ? message : internalMessage}
                                                onChange={(e) => activeTab === "chat" ? setMessage(e.target.value) : setInternalMessage(e.target.value)}
                                            />
                                            <button type="submit">
                                                <CgChevronRightO />
                                            </button>
                                        </form>
                                    </div>

                                    {isAdmin && (
                                        <div className="ticket-window-card ticket-window-notes-card">
                                            <div className="ticket-window-card-header">
                                                <h3>Notatki wewnętrzne</h3>
                                            </div>
                                            {internalNotes.length === 0 ? (
                                                <p className="ticket-window-empty">Brak notatek.</p>
                                            ) : (
                                                <ul className="ticket-window-notes-list">
                                                    {internalNotes.map(note => (
                                                        <li key={note.id}>
                                                            <strong>{new Date(note.createdAt).toLocaleString("pl-PL")}</strong>
                                                            <span>{note.message}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default TicketWindow;