import "./TicketList.css";
import { useAuth } from "../../context/AuthContext";
import { CgPinAlt } from "react-icons/cg";

function TicketCard ({ ticket, onClick, onAssign }) {
    const { user } = useAuth();
    const showAssignButton = user?.role === "admin" && ticket?.assignedAdminId === null;

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
            
            <h3> {ticket.title} </h3>
            
            <div className="ticket-footer">
                <span> {priorityTranslations[ticket.priority]} </span>
                <span> { new Date(ticket.createdAt).toLocaleDateString() } </span>
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

                <div className="ticket-title-line">

                <h3> {ticket.title} </h3>
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
                    <span> { new Date(ticket.createdAt).toLocaleDateString() } </span>
                </div>
            </div>
        );
    }
}
export default TicketCard;