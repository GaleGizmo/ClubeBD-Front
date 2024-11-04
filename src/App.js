import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./components/LandingPage/LandingPage";
import ComicDetail from "./components/ComicDetail/ComicDetail";
import UserSelect from "./components/UserSelect/UserSelect";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Header from "./components/Header/Header";
import AddComicForm from "./components/AddComic/AddComicForm";

function AuthenticatedApp() {
  const { user, logout } = useAuth();

  if (!user) {
    return <UserSelect />;
  }

  return (
    <div className="App">
       <Header logout={logout} />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/comic/:id" element={<ComicDetail />} />
        <Route path="/past-comics/:season" element={<LandingPage />} />
        <Route path="/add-comic" element={<AddComicForm/>} />
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
