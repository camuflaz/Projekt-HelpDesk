import "./TicketFilters.css";

function TicketFilters({search, setSearch, status, setStatus})
{
    return(
        <div className="ticket-filters">
            <input type="text" placeholder="Szukaj zgłoszenia..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value=""> Statusy </option>
                <option value="new"> Nowe </option>
                <option value="in-progress"> W realizacji </option>
                <option value="resolved"> Rozwiązane </option>
                <option value="closed"> Zamkniętnie </option>
            </select>
        </div>
    );
}
export default TicketFilters;