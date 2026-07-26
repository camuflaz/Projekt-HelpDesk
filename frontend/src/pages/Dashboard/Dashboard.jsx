import { useEffect, useState } from "react";
import "./Dashboard.css";
import TicketForm from "../../components/TicketForm/TicketForm";
import TicketList from "../../components/TicketList/TicketList";
import TicketDrawer from "../../components/TicketDrawer/TicketDrawer"
import { useAuth } from "../../context/AuthContext";
import TicketAdminStatistics from "../../components/Statistics/TicketAdminStatistics";

function Dashboard() {
    const [ticketId, setSelectedTicket] = useState(null);
    const [isActiveView, setIsActiveView] = useState(false);
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
                    onSelect={(ticket) => {
                        setSelectedTicket(ticket.id);
                        setIsActiveView(true);
                    }}/>
                </div>

                <div className="dashboard-box-lower">
                    <TicketList title="Zamknięte / Rozwiązane zgłoszenia" endpoint="my-closed"
                    onSelect={(ticket) => {
                        setSelectedTicket(ticket.id);
                        setIsActiveView(false);
                    }}/>
                </div>
            </div>
            <TicketDrawer ticketId={ticketId} 
                    onClose={() => {
                        setSelectedTicket(null);
                        setIsActiveView(false);
                    }}
                    isActiveView={isActiveView}/>
        </div>
     );
    }

    if(user.role === "admin"){
        return(
            <div className="dashboard admin">
                <div className="dashboard-left admin">
                    <div className="admin-card-header">
                        <TicketAdminStatistics />
                    </div>

                    <div className="admin-card-half">
                        <TicketList title="Otwarte zgłoszenia" endpoint="open-tickets"
                        onSelect={(ticket) => {
                            setSelectedTicket(ticket.id);
                            setIsActiveView(true);
                        }}/>
                    </div>

                    <div className="admin-card-half">
                        <TicketList title="Nowe wiadomości" endpoint="get-tickets-w-new-comments"
                        onSelect={(ticket) => {
                            setSelectedTicket(ticket.id);
                            setIsActiveView(true);
                        }}/>
                    </div>
                </div>

                <div className="dashboard-right">
                    <div className="dashboard-box-upper">
                        <TicketList title="Aktywne zgłoszenia" endpoint="my-active-admin"
                        onSelect={(ticket) => {
                            setSelectedTicket(ticket.id);
                            setIsActiveView(true);
                        }}/>
                    </div>

                    <div className="dashboard-box-lower">
                        <TicketList title="Zamknięte / Rozwiązane zgłoszenia" endpoint="my-closed-admin"
                        onSelect={(ticket) => {
                            setSelectedTicket(ticket.id);
                            setIsActiveView(false);
                        }}/>
                    </div>
                </div>
                <TicketDrawer ticketId={ticketId} 
                        onClose={() => {
                            setSelectedTicket(null);
                            setIsActiveView(false);
                        }}
                        isActiveView={isActiveView}/>
        </div>
        );
    }

}
export default Dashboard;