import{
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import MainLayout from "../pages/MainLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Tickets from "../pages/Tickets/Tickets";
import Settings from "../pages/Settings/Settings";
import Help from "../pages/Help/Help";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route  element={<MainLayout />}>

                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}