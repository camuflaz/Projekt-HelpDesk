import {NavLink, useNavigate} from "react-router-dom";
import "./Sidebar.css";
import API_URL from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";

import { CgBrowse, CgScreen, CgLogOut, CgOptions, CgInfo, CgChevronRight  } from "react-icons/cg";


function Sidebar() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [open, setOpen] = useState(true);
    const logout = async () => 
        {
        await fetch(`${API_URL}/auth/logout`,
            {
                method: "POST",
                credentials : "include"
            }
        );
        setUser(null);

        navigate("/login");
        };

    return (
        <div className={`sidebar ${open ? "open" : "closed"}`}>
            <div className="logo-section">
                <div className="logo-icon-box">H</div>
                {open && (
                    <motion.span
                        initial={{opacity: 0, x:-10}}
                        animate={{opacity: 1, x:0}}
                        transition={{delay: 0.120}}
                        className="logo-text">
                    HelpDesk
                    </motion.span>
                )}

            </div>

            <nav className="sidebar-nav">
                <MenuLink to="/dashboard" Icon={CgScreen} text="Dashboard" open={open} />
                <MenuLink to="/tickets" Icon={CgBrowse} text="Zgłoszenia" open={open} />
                <MenuLink to="/settings" Icon={CgOptions} text="Ustawienia" open={open} />
                <MenuLink to="/help" Icon={CgInfo} text="Pomoc" open={open} />
            </nav>


            <div className="sidebar-footer">
                    <button onClick={() => setOpen(!open)} className="toggle-btn">
                        <CgChevronRight className={`menu-icon arrow-icon ${open ? "rotate" : ""}`} />
                    </button>
                    <NavLink to = "/login" className="menu-item" onClick={async (e)=>{
                        e.preventDefault();
                        await logout();
                    }}>
                    <CgLogOut alt="Logout Icon" className="menu-icon" />
                    {open && (
                        <motion.span initial={{opacity:0}} animate={{opacity:1}} className="menu-text">
                        Wyloguj
                        </motion.span>
                    )}
                    </NavLink>
                
            </div>
        </div>
    );
}

const MenuLink = ({to, Icon, text, open}) => {
    return(
        <NavLink to={to} className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Icon className="menu-icon" />
            {open && (
                <motion.span 
                    initial={{opacity: 0, y:20, x:40}}
                    animate={{opacity: 1, y:0, x:0}}
                    transition={{delay: 0.20}}
                    className="menu-text">
                        {text}
                    </motion.span>
            )}
        </NavLink>
    );
};

export default Sidebar;