import { useEffect, useState } from "react";
import "./Dashboard.css";
import TicketForm from "../../components/TicketForm/TicketForm";
import TicketList from "../../components/TicketList/TicketList";
import TicketDrawer from "../../components/TicketDrawer/TicketDrawer"

function Dashboard() {
    const [ticketId, setSelectedTicket] = useState(null);
    return (
        <div className="dashboard">
            <div className="dashboard-left">
                <TicketForm />
            </div>

            <div className="dashboard-right">
                <div className="dashboard-box-upper">
                    <TicketList title="Aktywne zgłoszenia" endpoint="my-active"
                    onSelect={(ticket) => setSelectedTicket(ticket.id)}/>
                </div>

                <div className="dashboard-box-lower">
                    <TicketList title="Zamknięte / Rozwiązane zgłoszenia" endpoint="my-closed"
                    onSelect={(ticket) => setSelectedTicket(ticket.id)}/>
                </div>
            </div>
            <TicketDrawer ticketId={ticketId} 
                    onClose={() => setSelectedTicket(null)}/>
        </div>
     );
}
export default Dashboard;