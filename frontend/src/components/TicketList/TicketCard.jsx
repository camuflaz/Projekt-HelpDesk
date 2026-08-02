import "./TicketList.css";
import { useAuth } from "../../context/AuthContext";
import { CgPinAlt, CgCheckR, CgCloseR } from "react-icons/cg";

function TicketCard ({ ticket, onClick, onAssign, onUpdateStatus }) {
    const { user } = useAuth();
    const showAssignButton = user?.role === "admin" && ticket?.status === "new" && ticket?.assignedAdminId === null;
    const showStatusButtons = user?.role === "admin" && ticket?.status === "in-progress";

    const formatDate = (value) => {
        if (!value) return "";
        return new Date(value).toLocaleDateString("pl-PL", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
    };

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


    if(user?.role === "user"){
    return (
        <div className="ticket-card" onClick={onClick}>
            <div className="ticket-header user">
                <span className={`status ${ticket.status}`}> {statusTranslations[ticket.status]} </span>
                
            </div>
            
            <div className="ticket-title-line no-button">
                <h3>{ticket.title}</h3>
            </div>
            
            <div className="ticket-footer">
                <span> {priorityTranslations[ticket.priority]} </span>
                <span> {formatDate(ticket.createdAt)} </span>
            </div>
        </div>
    );
    }

    if(user?.role === "admin"){
        return(
            <div className="ticket-card" onClick={onClick}>
                <div className="ticket-header">
                    <span>#{ticket.id}</span>
                    <span className={`status ${ticket.status}`}> {statusTranslations[ticket.status]} </span>
                </div>

                <div className={`ticket-title-line ${showAssignButton || showStatusButtons ? "with-button" : "no-button"}`}>
                    <h3>{ticket.title}</h3>
                    {(showAssignButton || showStatusButtons) && (
                        <div className="ticket-action-buttons" onClick={(e) => e.stopPropagation()}>
                            {showAssignButton && (
                                <button
                                    className="assigned-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const confirmed = window.confirm("Czy na pewno chcesz przypiąć zgłoszenie do siebie?");
                                        if (confirmed) {
                                            onAssign?.(ticket.id, user.id);
                                        }
                                    }}
                                >
                                    <CgPinAlt />
                                </button>
                            )}

                            {showStatusButtons && (
                                <>
                                    <button
                                        className="status-action-button resolve"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const confirmed = window.confirm("Czy chcesz zmienić status zgłoszenia na Rozwiązane?");
                                            if (confirmed) {
                                                onUpdateStatus?.(ticket.id, "resolved");
                                            }
                                        }}
                                    >
                                        <CgCheckR />
                                    </button>
                                    <button
                                        className="status-action-button close"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const confirmed = window.confirm("Czy chcesz zmienić status zgłoszenia na Zamknięte?");
                                            if (confirmed) {
                                                onUpdateStatus?.(ticket.id, "closed");
                                            }
                                        }}
                                    >
                                        <CgCloseR />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="ticket-footer">
                    <span> {priorityTranslations[ticket.priority]} </span>
                    <span> {formatDate(ticket.createdAt)} </span>
                </div>
            </div>
        );
    }
}
export default TicketCard;