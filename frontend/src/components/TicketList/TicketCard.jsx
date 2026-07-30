import "./TicketList.css";
import { useAuth } from "../../context/AuthContext";
import { CgPinAlt } from "react-icons/cg";

function TicketCard ({ ticket, onClick, onAssign }) {
    const { user } = useAuth();
    const showAssignButton = user?.role === "admin" && ticket?.assignedAdminId === null;

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
            <div className="ticket-header">
                <span>#{ticket.id}</span>
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

                <div className={`ticket-title-line ${showAssignButton ? "with-button" : "no-button"}`}>
                <h3>{ticket.title}</h3>
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