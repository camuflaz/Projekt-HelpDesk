import { useState } from "react";
import "./TicketFilters.css";
import { motion } from "framer-motion";
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
                    <motion.button
                        className="filter-toggle"
                        tabIndex={0}
                        whileHover={{ duration: 0.2, backgroundColor: "#3a78ee" }}
                        whileTap={{ scale: 0.90 }}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setShowAdvanced(!showAdvanced);
                            }
                        }}
                    >
                        Filtry
                    </motion.button>
                </div>
            </div>

            <motion.div
                className={`ticket-filters-panel-wrapper ${showAdvanced ? "is-open" : "is-closed"}`}
                initial={false}
                animate={{ gridTemplateRows: showAdvanced ? "1fr" : "0fr" }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                aria-hidden={!showAdvanced}
                inert={!showAdvanced ? "" : undefined}
            >
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
            </motion.div>
        </div>
    );
}

export default TicketFilters;