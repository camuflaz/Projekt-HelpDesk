import { useEffect, useState } from "react";
import API_URL from "../../services/api";
import TicketCard from "./TicketCard";

function TicketList({title, endpoint}) {
    const [tickets, setTickets] = useState([]);
    useEffect(() => {
        loadTickets();
    }, [endpoint]);

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
        <>
            <h2>{title}</h2>
            {
                tickets.length === 0 ? <p>Brak zgłoszeń w tej kategorii</p>
                :
                tickets.map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                ))
            }
        </>
    );
}
export default TicketList;