import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../services/api";
import { CgNotes, CgCheckO, CgTime, CgAdd } from "react-icons/cg";
import "./TicketAdminStatistics.css";
import { secondsToMilliseconds } from "framer-motion";

function TicketAdminStatistics() {
    const { user } = useAuth();
    const [ loading, setLoading ] = useState(false);
    const [stats, setStats] = useState({
        activeTickets: 0,
        newTicketsAvailable: 0,
        closedAndResolvedTickets: 0,
        averageCompletionTime: ""
    });

    useEffect(() => {
        if (!user || user.role !== "admin") {
            return;
        }

        async function loadStats() {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/tickets/admin-statistics`, {
                    credentials: "include"
                });

                if(response.ok){    
                    const data = await response.json();
                    setStats(data);
                }

            }
            
            finally{
                setLoading(false);
            }
        }

        loadStats();
    }, [user]);

    const statCards = [
        {
            key: "activeTickets",
            label: "Aktywne zgłoszenia",
            value: stats.activeTickets,
            icon: <CgNotes className="stat-icon" />
        },
        {
            key: "newTicketsAvailable",
            label: "Nowe zgłoszenia",
            value: stats.newTicketsAvailable,
            icon: <CgAdd className="stat-icon" />
        },
        {
            key: "closedAndResolvedTickets",
            label: "Ukończone zgłoszenia",
            value: stats.closedAndResolvedTickets,
            icon: <CgCheckO className="stat-icon" />
        },
        {
            key: "averageCompletionTime",
            label: "Śr. czas realizacji",
            value: stats.averageCompletionTime || "0 minut",
            icon: <CgTime className="stat-icon" />
        }
    ];

    return (
        <div className="admin-stats-grid">
            {statCards.map((card) => (
                <div key={card.key} className="admin-stat-card">
                    <div className="admin-stat-icon">{card.icon}</div>
                    <div className={"admin-stat-content-"+card.key}>
                        <div className="admin-stat-label">{card.label}</div>
                        <div className="admin-stat-value">{card.value}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TicketAdminStatistics;
