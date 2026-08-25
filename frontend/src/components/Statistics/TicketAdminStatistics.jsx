import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../services/api";
import { CgNotes, CgCheckO, CgAlarm, CgAdd, CgCloseO } from "react-icons/cg";
import "./TicketAdminStatistics.css";
import {
    getCachedStatistics,
    hasFreshStatisticsCache,
    setCachedStatistics,
    subscribeToTicketRefresh
} from "../../services/ticketRefresh";

function TicketAdminStatistics() {
    const { user } = useAuth();
    const [stats, setStats] = useState(() => getCachedStatistics() ?? {
        activeTickets: 0,
        newTicketsAvailable: 0,
        ResolvedTickets: 0,
        ClosedTickets: 0,
        averageCompletionTime: ""
    });

    useEffect(() => {
        if (!user || user.role !== "admin") {
            return;
        }

        async function loadStats(forceRefresh = false) {
            if (!forceRefresh && hasFreshStatisticsCache()) {
                return;
            }

            try {
                const response = await fetch(`${API_URL}/tickets/admin-statistics`, {
                    credentials: "include"
                });

                if(response.ok){    
                    const data = await response.json();
                    setCachedStatistics(data);
                    setStats(data);
                }

            }
            catch (error) {
                console.error(error);
            }
        }

        loadStats();

        const unsubscribe = subscribeToTicketRefresh(() => {
            loadStats(true);
        });

        return unsubscribe;
    }, [user]);

    const statCards = [
        {
            key: "activeTickets",
            label: "Aktywne zgłoszenia",
            value: stats.activeTickets || 0,
            icon: <CgNotes className="stat-icon" />
        },
        {
            key: "newTicketsAvailable",
            label: "Nowe zgłoszenia",
            value: stats.newTicketsAvailable || 0,
            icon: <CgAdd className="stat-icon" />
        },
        {
            key: "ResolvedTickets",
            label: "Rozwiązane zgłoszenia",
            value: stats.resolvedTickets || 0,
            icon: <CgCheckO className="stat-icon" />
        },
        {
            key: "ClosedTickets",
            label: "Zamknięte zgłoszenia",
            value: stats.closedTickets || 0,
            icon: <CgCloseO className="stat-icon" />
        },
        {
            key: "averageCompletionTime",
            label: "Śr. czas realizacji",
            value: stats.averageCompletionTime || "0 minut",
            icon: <CgAlarm className="stat-icon" />
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
