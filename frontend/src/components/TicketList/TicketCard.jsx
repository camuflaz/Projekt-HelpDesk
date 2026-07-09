import "./TicketList.css";

function TicketCard ({ ticket }) {
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

    return (
        <div className="ticket-card">
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
export default TicketCard;