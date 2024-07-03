import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./components/LandingPage/LandingPage";
import ComicDetail from "./components/ComicDetail/ComicDetail";
import UserSelect from "./components/UserSelect/UserSelect";
import { ToastContainer } from "react-toastify";
import { IoLogOutOutline } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function AuthenticatedApp() {
  const { user, logout } = useAuth();

  if (!user) {
    return <UserSelect />;
  }

  return (
    <div className="App">
      <nav>
        <button className="logout-button" onClick={logout}><IoLogOutOutline/></button>
      </nav>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/comic/:id" element={<ComicDetail />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthenticatedApp />
      </Router>
    </AuthProvider>
  );
}

export default App;
