import { useEffect, useState } from "react";
import API_URL from "../../services/api";
import { notifyTicketRefresh, subscribeToTicketRefresh } from "../../services/ticketRefresh";
import TicketCard from "./TicketCard";

function TicketList({title, endpoint, onSelect}) {
    const [tickets, setTickets] = useState([]);
    useEffect(() => {
        loadTickets();

        const unsubscribe = subscribeToTicketRefresh(() => {
            loadTickets();
        });

        return unsubscribe;
    }, [endpoint]);

    async function handleAssignTicket(ticketId, adminId) {
        const response = await fetch(`${API_URL}/tickets/${ticketId}/assign`, {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            setTickets(prevTickets =>
                prevTickets.map(ticket =>
                    ticket.id === ticketId
                        ? { ...ticket, assignedAdminId: adminId, status: "in-progress" }
                        : ticket
                )
            );
            notifyTicketRefresh();
        }
    }

    async function handleUpdateStatus(ticketId, nextStatus) {
        const response = await fetch(`${API_URL}/tickets/${ticketId}/status`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: nextStatus, comment: "" })
        });

        if (response.ok) {
            setTickets(prevTickets =>
                prevTickets.map(ticket =>
                    ticket.id === ticketId
                        ? { ...ticket, status: nextStatus }
                        : ticket
                )
            );
            notifyTicketRefresh();
        }
    }

    async function loadTickets() {
        const response = await fetch(`${API_URL}/tickets/${endpoint}`,
            {
                credentials: 'include'
            }
        );

        if (response.ok){
            const data = await response.json();
            setTickets(data);
        }
    }

    return(
        <div className="ticket-list">
            <h2 className="ticket-list-title">{title}</h2>
            {
                tickets.length === 0 ? <p className="ticket-list-empty">Brak zgłoszeń w tej kategorii</p>
                :
                tickets.map(ticket => (
                    <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        onClick={() => onSelect(ticket)}
                        onAssign={handleAssignTicket}
                        onUpdateStatus={handleUpdateStatus}
                    />
                ))
            }
        </div>
    );
}
export default TicketList;