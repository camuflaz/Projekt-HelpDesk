import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Help.css";

function Help() {
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            question: "Czym jest HelpDesk?",
            answer: "HelpDesk to aplikacja do obsługi zgłoszeń IT i pomocy użytkownikom. Umożliwia składanie problemów technicznych, monitorowanie ich statusu oraz komunikację między użytkownikiem a administratorem wsparcia."
        },
        {
            question: "Jak utworzyć nowe zgłoszenie?",
            answer: "Po zalogowaniu przejdź do panelu głównego i w sekcji „Nowe zgłoszenie” wpisz tytuł, krótki opis problemu, wybierz kategorię (np. Hardware, Software, Sieć, Office lub Inne), ustaw priorytet oraz ewentualnie dodaj tagi. Po wysłaniu zgłoszenia pojawi się w aktywnych zgłoszeniach użytkownika."
        },
        {
            question: "Jakie są dostępne kategorie i priorytety?",
            answer: "System obsługuje kategorie: Hardware, Software, Sieć, Office oraz Inne. Priorytety to: niski, średni, wysoki i krytyczny."
        },
        {
            question: "Jak sprawdzić status zgłoszenia?",
            answer: "Po zalogowaniu w panelu użytkownika można przejrzeć listę „Aktywne zgłoszenia” i „Zamknięte / Rozwiązane zgłoszenia”. Po kliknięciu w zgłoszenie otwiera się szczegółowy widok, w którym widać status, priorytet, kategorię, opis oraz chat z administratorem."
        },
        {
            question: "Jak działa komunikacja w zgłoszeniu?",
            answer: "W szczegółach zgłoszenia można wysłać wiadomość do administratora. Użytkownik może pisać do zespołu wsparcia, a administrator może odpowiadać lub aktualizować status sprawy."
        },
        {
            question: "Co mogą robić administratorzy?",
            answer: "Administrator ma dostęp do statystyk, listy otwartych zgłoszeń, nowych wiadomości oraz swoich aktywnych i zamkniętych spraw. Może przypisać zgłoszenie do siebie, zmieniać status na Nowe, W realizacji, Rozwiązane lub Zamknięte oraz przeglądać szczegóły każdego ticketu."
        },
        {
            question: "Czy mogę filtrować i wyszukiwać zgłoszenia?",
            answer: "Tak. W sekcji zgłoszeń dostępne są filtrowanie po tekście, statusie, priorytecie, kategorii oraz zakresie dat. To pozwala szybko znaleźć konkretne zgłoszenie z listy."
        },
        {
            question: "Jak mogę zmienić dane konta lub hasło?",
            answer: "W zakładce Ustawienia można zmienić nazwę użytkownika, adres e-mail oraz hasło. Istnieje także możliwość usunięcia konta."
        },
        {
            question: "Czy aplikacja obsługuje wiele ról użytkowników?",
            answer: "Tak. Aplikacja rozróżnia użytkowników zwykłych i administratorów. Użytkownik składa zgłoszenia i śledzi ich przebieg, natomiast administrator zarządza obsługą, przydziela zgłoszenia i monitoruje statystyki."
        }
    ];

    return (
        <div className="help-page">
            <div className="help-page_header">
            <h1>Pomoc i FAQ</h1>
            </div>

            <section className="help-page_section">
                <h2>Najczęściej zadawane pytania</h2>
                <div className="help-page_faq">
                    {faqs.map((faq, index) => {
                        const isOpen = openFaq === index;
                        const answerId = `help-faq-answer-${index}`;

                        return (
                            <motion.article
                                key={faq.question}
                                className={`help-page_faq-item${isOpen ? " active" : ""}`}
                                whileHover={{
                                    borderColor: isOpen ? "#5271ff" : "#d0d5dd",
                                    backgroundColor: isOpen ? "#f5f7ff" : "#f9fafb"
                                }}
                                transition={{ duration: 0.12 }}
                            >
                                <button
                                    className="help-page_faq-question"
                                    type="button"
                                    aria-expanded={isOpen}
                                    aria-controls={answerId}
                                    onClick={() => setOpenFaq(isOpen ? null : index)}
                                >
                                    {faq.question}
                                    <span className="help-page_faq-indicator" aria-hidden="true">
                                        {isOpen ? "−" : "+"}
                                    </span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={answerId}
                                            className="help-page_faq-answer"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                        >
                                            <p>{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.article>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

export default Help;