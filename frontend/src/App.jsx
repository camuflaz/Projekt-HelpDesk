import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Dashboard from "./pages/Dashboard/Dashboard";
import Tickets from "./pages/Tickets/Tickets";
import Settings from "./pages/Settings/Settings";
import Help from "./pages/Help/Help";
import Login from "./pages/Login/Login";
import { useAuth } from "./context/AuthContext";
import { use } from "react";

function App() {
  function LoginRedirect({children})
  {
    const { user, loading } = useAuth();

    if(loading)
      return null;

    if(user)
    {
      return (<Navigate to ='/dashboard' replace />);
    }
    return children;
  }

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<LoginRedirect><Login /></LoginRedirect>} />

      <Route element={<MainLayout />}>

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />

      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />

      </Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App
