import { useEffect, useState } from "react";
import "./Dashboard.css";
import TicketForm from "../../components/TicketForm/TicketForm";
import TicketList from "../../components/TicketList/TicketList";
import TicketDrawer from "../../components/TicketDrawer/TicketDrawer"
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
    const [ticketId, setSelectedTicket] = useState(null);
    const { user } = useAuth();

    if(!user){
        return <div className="loading">Ładowanie panelu...</div>;
    }

    if(user.role === "user"){
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

    if(user.role === "admin"){
        return(
            <div className="dashboard admin">
                <div className="dashboard-left admin">
                    <div className="admin-card-header">
                        
                    </div>

                    <div className="admin-card-half">
                        <TicketList title="Otwarte zgłoszenia" endpoint="open-tickets"
                        onSelect={(ticket) => setSelectedTicket(ticket.id)}/>
                    </div>

                    <div className="admin-card-half">
                        
                    </div>
                </div>

                <div className="dashboard-right">
                    <div className="dashboard-box-upper">
                        <TicketList title="Aktywne zgłoszenia" endpoint="my-active-admin"
                        onSelect={(ticket) => setSelectedTicket(ticket.id)}/>
                    </div>

                    <div className="dashboard-box-lower">
                        <TicketList title="Zamknięte / Rozwiązane zgłoszenia" endpoint="my-closed-admin"
                        onSelect={(ticket) => setSelectedTicket(ticket.id)}/>
                    </div>
                </div>
                <TicketDrawer ticketId={ticketId} 
                        onClose={() => setSelectedTicket(null)}/>
        </div>
        );
    }

}
export default Dashboard;