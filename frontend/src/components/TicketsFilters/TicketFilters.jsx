import { useState } from "react";
import "./TicketFilters.css";

function TicketFilters({ filters, onChange }) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    function updateFilter(key, value) {
        onChange({
            ...filters,
            [key]: value,
            page: 1
        });
    }

    return (
        <div className="ticket-filters">
            <div className="ticket-filters-main">
                <div className="ticket-filters-left">
                    <input
                        type="text"
                        placeholder="Szukaj zgłoszenia..."
                        value={filters.search || ""}
                        onChange={(e) => updateFilter("search", e.target.value)}
                    />
                </div>

                <div className="ticket-filters-right">
                    <div
                        className="filter-toggle"
                        role="button"
                        tabIndex={0}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setShowAdvanced(!showAdvanced);
                            }
                        }}
                    >
                        Filtry
                    </div>
                </div>
            </div>

            {showAdvanced && (
                <div className="ticket-filters-panel">
                    <label className="filter-field">
                        <span>Status</span>
                        <select value={filters.status || ""} onChange={(e) => updateFilter("status", e.target.value)}>
                            <option value="">Wszystkie</option>
                            <option value="new">Nowe</option>
                            <option value="in-progress">W realizacji</option>
                            <option value="resolved">Rozwiązane</option>
                            <option value="closed">Zamknięte</option>
                        </select>
                    </label>

                    <label className="filter-field">
                        <span>Priorytet</span>
                        <select value={filters.priority || ""} onChange={(e) => updateFilter("priority", e.target.value)}>
                            <option value="">Wszystkie</option>
                            <option value="low">Niski</option>
                            <option value="medium">Średni</option>
                            <option value="high">Wysoki</option>
                            <option value="critical">Krytyczny</option>
                        </select>
                    </label>

                    <label className="filter-field">
                        <span>Kategoria</span>
                        <select value={filters.category || ""} onChange={(e) => updateFilter("category", e.target.value)}>
                            <option value="">Wszystkie</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                            <option value="Sieć">Sieć</option>
                            <option value="Office">Office</option>
                            <option value="Inne">Inne</option>
                        </select>
                    </label>

                    <label className="filter-field">
                        <span>Zakres dat</span>
                        <div className="date-range">
                            <input
                                type="date"
                                value={filters.dateFrom || ""}
                                onChange={(e) => updateFilter("dateFrom", e.target.value)}
                            />
                            <span>-</span>
                            <input
                                type="date"
                                value={filters.dateTo || ""}
                                onChange={(e) => updateFilter("dateTo", e.target.value)}
                            />
                        </div>
                    </label>
                </div>
            )}
        </div>
    );
}

export default TicketFilters;