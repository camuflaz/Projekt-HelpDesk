import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Settings.css";
import { motion } from "framer-motion";

function Settings() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState(user?.username ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [currentUsernamePassword, setCurrentUsernamePassword] = useState("");
    const [currentEmailPassword, setCurrentEmailPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [deletePassword, setDeletePassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("username");

    const updateProfile = async (event, changes, clearForm) => {
        event.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await fetch(`${API_URL}/auth/profile`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(changes),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Nie można zaktualizować konta.");
            }

            setUser(data);
            setUsername(data.username);
            setEmail(data.email);
            clearForm();
            setMessage("Twoje dane konta zostały zaktualizowane.");
        } catch (requestError) {
            setError(requestError.message || "Nie można połączyć się z serwerem.");
        }
    };

    const handleUsernameChange = (event) => updateProfile(
        event,
        { currentPassword: currentUsernamePassword, username: newUsername },
        () => {
            setNewUsername("");
            setCurrentUsernamePassword("");
        }
    );

    const handleEmailChange = (event) => updateProfile(
        event,
        { currentPassword: currentEmailPassword, email: newEmail },
        () => {
            setNewEmail("");
            setCurrentEmailPassword("");
        }
    );

    const handlePasswordChange = (event) => {
        event.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setMessage("");
            setError("Nowe hasła nie są zgodne.");
            return;
        }

        updateProfile(
            event,
            { currentPassword, newPassword },
            () => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            }
        );
    };

    const handleAccountDeletion = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        if (!window.confirm(
            "Czy jesteś pewien, że chcesz usunąć konto? Twój profil wraz ze wszystkimi szczegółami zostanie przechowany w archiwum, a historia twoich zgłoszeń pozostanie anonimowa."
        )) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/account`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: deletePassword }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Nie można usunąć konta.");
            }

            setUser(null);
            navigate("/login", { replace: true });
        } catch (requestError) {
            setError(requestError.message || "Nie można połączyć się z serwerem.");
        }
    };

    return (
        <div className="settings">

            {message && <div className="settings_notice success" role="status">{message}</div>}
            {error && <div className="settings_notice error" role="alert">{error}</div>}

            <nav className="settings_cards" aria-label="Settings sections">
                <motion.button
                    whileTap={{ scale: 0.90 }}
                    type="button"
                    className={`settings_card${activeSection === "username" ? " active" : ""}`}
                    aria-pressed={activeSection === "username"}
                    onClick={() => setActiveSection("username")}
                >
                    <span>Nazwa użytkownika</span>
                    <small>Zmień nazwę użytkownika</small>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.90 }}
                    type="button"
                    className={`settings_card${activeSection === "email" ? " active" : ""}`}
                    aria-pressed={activeSection === "email"}
                    onClick={() => setActiveSection("email")}
                >
                    <span>Email</span>
                    <small>Zmień adres email</small>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.90 }}
                    type="button"
                    className={`settings_card${activeSection === "password" ? " active" : ""}`}
                    aria-pressed={activeSection === "password"}
                    onClick={() => setActiveSection("password")}
                >
                    <span>Hasło</span>
                    <small>Zmień hasło</small>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.90 }}
                    type="button"
                    className={`settings_card${activeSection === "delete" ? " active" : ""}`}
                    aria-pressed={activeSection === "delete"}
                    onClick={() => setActiveSection("delete")}
                >
                    <span>Usuń konto</span>
                    <small>Usuń swoje konto</small>
                </motion.button>
            </nav>

            {activeSection === "username" && <div className="settings_section settings_username">
                <h2>Zmiana nazwy użytkownika</h2>
                <form onSubmit={handleUsernameChange}>
                    <label htmlFor="currentUsername">Aktualna nazwa użytkownika</label>
                    <input type="text" id="currentUsername" value={username} readOnly />

                    <label htmlFor="newUsername">Nowa nazwa użytkownika</label>
                    <input
                        type="text"
                        id="newUsername"
                        value={newUsername}
                        onChange={(event) => setNewUsername(event.target.value)}
                        maxLength="50"
                        required
                    />

                    <label htmlFor="currentUsernamePassword">Potwierdź przy pomocy hasła</label>
                    <input
                        type="password"
                        id="currentUsernamePassword"
                        value={currentUsernamePassword}
                        onChange={(event) => setCurrentUsernamePassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    <motion.button type="submit" whileHover={{ duration: 0.2, backgroundColor: "#3a78ee" }}>
                        Zapisz nazwe użytkownika
                    </motion.button>
                </form>
            </div>}

            {activeSection === "email" && <div className="settings_section settings_email">
                <h2>Zmiana email</h2>
                <form onSubmit={handleEmailChange}>
                    <label htmlFor="currentEmail">Aktualny email</label>
                    <input type="email" id="currentEmail" value={email} readOnly />

                    <label htmlFor="newEmail">Nowy email</label>
                    <input
                        type="email"
                        id="newEmail"
                        value={newEmail}
                        onChange={(event) => setNewEmail(event.target.value)}
                        maxLength="50"
                        required
                    />

                    <label htmlFor="currentEmailPassword">Potwierdź przy pomocy hasła</label>
                    <input
                        type="password"
                        id="currentEmailPassword"
                        value={currentEmailPassword}
                        onChange={(event) => setCurrentEmailPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    <motion.button whileHover={{ duration: 0.2, backgroundColor: "#3a78ee" }} type="submit">
                        Zapisz email
                    </motion.button>
                </form>
            </div>}

            {activeSection === "password" && <div className="settings_section settings_password">
                <h2>Zmiana hasła</h2>
                <form onSubmit={handlePasswordChange}>
                    <label htmlFor="currentPassword">Aktualne hasło</label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    <label htmlFor="newPassword">Nowe hasło</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        minLength="8"
                        autoComplete="new-password"
                        required
                    />

                    <label htmlFor="confirmNewPassword">Potwierdź nowe hasło</label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(event) => setConfirmNewPassword(event.target.value)}
                        minLength="8"
                        autoComplete="new-password"
                        required
                    />

                    <motion.button whileHover={{ duration: 0.2, backgroundColor: "#3a78ee" }} type="submit">
                        Zapisz hasło
                    </motion.button>
                </form>
            </div>}

            {activeSection === "delete" && <div className="settings_section settings_delete">
                <h2>Usuń konto</h2>
                <p>Spowoduje to trwałe usunięcie Twojego konta. Szczegóły Twojego profilu zostaną zarchiwizowane; zgłoszenia i komentarze będą zachowane anonimowo.</p>
                <form onSubmit={handleAccountDeletion}>
                    <label htmlFor="deletePassword">Potwierdź przy pomocy hasła</label>
                    <input
                        type="password"
                        id="deletePassword"
                        value={deletePassword}
                        onChange={(event) => setDeletePassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    <motion.button whileHover={{ duration: 0.2, backgroundColor: "#a61b1b" }} type="submit" className="danger_button">
                        Usuń konto
                    </motion.button>
                </form>
            </div>}
        </div>
    );
}
export default Settings;