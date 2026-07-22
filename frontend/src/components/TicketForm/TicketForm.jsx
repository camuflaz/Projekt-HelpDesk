import "./TicketForm.css";
import { useState } from "react";
import API_URL from "../../services/api";
import { notifyTicketRefresh } from "../../services/ticketRefresh";

function TicketForm() {
    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [category, setCategory] = useState("");

    const [priority, setPriority] = useState("");

    const [tags, setTags] = useState("");

    function handleChange(setter) { 
        return (e) => {
        const inputElement = e.target;
        const value = inputElement.value;

        if (value.length >= 100){
            inputElement.setCustomValidity('Przekroczono limit znaków! Maksymalna długość to 100 znaków')
            inputElement.reportValidity();
        }else{
            inputElement.setCustomValidity("");
        }

        setter(value);
        
        };
    }
    

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch(`${API_URL}/tickets`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },

            body:JSON.stringify({
                title,
                description,
                category,
                priority,
                tags,
            })
        });

        if(response.ok) {
            alert("Zgłoszenie zostało utworzone pomyślnie!");

            setTitle("");
            setDescription("");
            setCategory("");
            setPriority("");
            setTags("");
            notifyTicketRefresh();
        }

        else {
            alert("Wystąpił błąd podczas tworzenia zgłoszenia. Spróbuj ponownie.");
        }
    }
        return (
            <div className="ticket-form-card">
                <h2>Nowe zgłoszenie</h2>
                <form onSubmit={handleSubmit}>

                    <label>Tytuł:</label>
                    <input
                        value={title}
                        onChange={handleChange(setTitle)}
                        required
                        maxLength={100}
                    />


                    <label>Opis:</label>
                    <textarea
                        rows="8"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <label>Kategoria:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Wybierz kategorię</option>
                        <option>Hardware</option>
                        <option>Software</option>
                        <option>Sieć</option>
                        <option>Office</option>
                        <option>Inne</option>

                    </select>

                    <label>Priorytet:</label>

                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        required
                    >
                        <option value="">Wybierz priorytet</option>
                        <option value="low">Niski</option>
                        <option value="medium">Średni</option>
                        <option value="high">Wysoki</option>
                        <option value="critical">Krytyczny</option>
                    </select>

                    <label>Tagi:</label>
                    <input
                        placeholder="Wprowadź tagi oddzielone przecinkami np. VPN, Windows, Office, myszka itp."
                        value={tags}
                        onChange={handleChange(setTags)}
                        maxLength={100}
                    />

                    <button type="submit">Utwórz zgłoszenie</button>
                </form>
            </div>
        );
}
export default TicketForm;

