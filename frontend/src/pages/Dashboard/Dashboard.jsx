import { useEffect } from "react";
import "./Dashboard.css";
import TicketForm from "../../components/TicketForm/TicketForm";

function Dashboard() {
    return (
        <div className="dashboard">
            <div className="dashboard-left">
                <TicketForm />
            </div>

            <div className="dashboard-right">
                <div className="dashboard-box-upper">
                    <h2>Aktywne zgłoszenia</h2>
                </div>

                <div className="dashboard-box-lower">
                    <h2>Zamknięte zgłoszenia</h2>
                </div>
            </div>
        </div>
     );
}
export default Dashboard;