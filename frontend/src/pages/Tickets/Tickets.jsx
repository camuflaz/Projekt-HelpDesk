import { useState, useEffect } from "react";
import "./Tickets.css";
import Pagination from "../../components/Pagination/Pagination";
import TicketFilters from "../../components/TicketsFilters/TicketFilters";
import API_URL from "../../services/api";
import TicketCard from "../../components/TicketList/TicketCard";
import TicketWindow from "../../components/TicketWIndow/TicketWindow";
import {
    getCachedTicketPage,
    hasFreshTicketPageCache,
    notifyTicketRefresh,
    setCachedTicketPage,
    subscribeToTicketRefresh
} from "../../services/ticketRefresh";

const initialQuery = {
    page: 1,
    pageSize: 12,
    search: "",
    status: "",
    priority: "",
    category: "",
    dateFrom: "",
    dateTo: ""
};

function getTicketCacheKey(query) {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (value) {
            params.append(key, value);
        }
    });

    return `all-tickets?${params.toString()}`;
}

function Tickets() {
    const initialCachedPage = getCachedTicketPage(getTicketCacheKey(initialQuery));
    const [tickets, setTickets] = useState(initialCachedPage?.items);
    const [selectedTicket, setSelectedTicket] = useState();
    const [loading, setLoading] = useState(!initialCachedPage);
    const [query, setQuery] = useState(initialQuery);

    const [totalPages, setTotalPages] = useState(initialCachedPage?.totalPages ?? 1);

    async function handleAssignTicket(ticketId, adminId) {
        const response = await fetch(`${API_URL}/tickets/${ticketId}/assign`, {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            setTickets(prevTickets => {
                const nextTickets = (prevTickets ?? []).map(ticket =>
                    ticket.id === ticketId
                        ? { ...ticket, assignedAdminId: adminId, status: "in-progress" }
                        : ticket
                );
                const cacheKey = getTicketCacheKey(query);
                const cachedPage = getCachedTicketPage(cacheKey);
                setCachedTicketPage(cacheKey, { ...cachedPage, items: nextTickets });
                return nextTickets;
            });
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
            setTickets(prevTickets => {
                const nextTickets = (prevTickets ?? []).map(ticket =>
                    ticket.id === ticketId
                        ? { ...ticket, status: nextStatus }
                        : ticket
                );
                const cacheKey = getTicketCacheKey(query);
                const cachedPage = getCachedTicketPage(cacheKey);
                setCachedTicketPage(cacheKey, { ...cachedPage, items: nextTickets });
                return nextTickets;
            });
            notifyTicketRefresh();
        }
    }

    async function loadTickets(forceRefresh = false) {
        const cacheKey = getTicketCacheKey(query);
        const cachedPage = getCachedTicketPage(cacheKey);

        if (cachedPage) {
            setTickets(cachedPage.items);
            setTotalPages(cachedPage.totalPages);
            setLoading(false);
        } else {
            setLoading(true);
        }

        if (!forceRefresh && hasFreshTicketPageCache(cacheKey)) {
            return;
        }

        try{
            const params = new URLSearchParams();

            params.append("page", query.page);
            params.append("pageSize", query.pageSize);

            if(query.search)
                params.append("search", query.search);

            if(query.status)
                params.append("status", query.status);

            if(query.priority)
                params.append("priority", query.priority);

            if(query.category)
                params.append("category", query.category);

            if(query.dateFrom)
                params.append("dateFrom", query.dateFrom);

            if(query.dateTo)
                params.append("dateTo", query.dateTo);

            const response = await fetch(`${API_URL}/tickets/all-tickets?${params.toString()}`,
            {
                credentials: "include"
            }
        );
        
            if(!response.ok){
                return;
            }

            const data = await response.json();

            setCachedTicketPage(cacheKey, data);
            setTickets(data.items);
            setTotalPages(data.totalPages);
    }

        finally{
            setLoading(false);
        }

    }

    useEffect(() => {
        loadTickets();

        const unsubscribe = subscribeToTicketRefresh(() => {
            loadTickets(true);
        });

        return unsubscribe;
    }, [query]);



    return (
        <div className="tickets">
            <div className="tickets-header">
                <TicketFilters filters={query} onChange={setQuery}/>
            </div>

            <div className="tickets-body">
                {
                    loading ? 
                    <div className="loading">
                        Ładowanie... 
                    </div>
                    :
                    tickets.length === 0 ?
                        <div className="empty">
                            Nie znaleziono zgłoszeń.
                        </div>
                        :
                        tickets.map(ticket => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                onClick={() => setSelectedTicket(ticket.id)}
                                onAssign={handleAssignTicket}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))

                }
            </div>

            <div className="tickets-footer">
                <Pagination page={query.page} totalPages={totalPages} onChange={(page) => 
                    setQuery({
                    ...query,
                    page
                    })
                    }
                />
            </div>

            <TicketWindow
                ticketId={selectedTicket}
                onClose={() => setSelectedTicket(null)}
            />
        </div>
     );
}
export default Tickets;