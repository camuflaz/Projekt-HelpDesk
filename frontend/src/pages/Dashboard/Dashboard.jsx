import { useEffect } from "react";
import "./Dashboard.css";
import TicketForm from "../../components/TicketForm/TicketForm";
import TicketList from "../../components/TicketList/TicketList";

function Dashboard() {
    return (
        <div className="dashboard">
            <div className="dashboard-left">
                <TicketForm />
            </div>

            <div className="dashboard-right">
                <div className="dashboard-box-upper">
                    <TicketList title="Aktywne zgłoszenia" endpoint="my-active"/>
                </div>

                <div className="dashboard-box-lower">
                    <TicketList title="Zamknięte / Rozwiązane zgłoszenia" endpoint="my-closed"/>
                </div>
            </div>
        </div>
     );
}
export default Dashboard;