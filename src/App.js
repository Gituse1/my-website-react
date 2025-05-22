import React, { useState, useEffect } from "react";
import InvestorsPage from "./components/InvestorsPage";
import MarketPage from "./components/MarketPage";
import StartupApp from "./components/StartupApp";
import Reports from "./components/Reports";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
//import StartupsPage from "./components/StartupsPage"; 
import UserProfile from "./components/UserProfile";
import { auth } from "./firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./styles/style.css";

function App() {
  const [currentPage, setCurrentPage] = useState("investors");
  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setCurrentPage("investors");
        setAuthMessage("");
      }
    });
    return () => unsubscribe();
  }, []);

  const handlePageChange = (page) => {
    if (page === "startup" && !user) {
      setAuthMessage("Потрібна авторизація");
      setCurrentPage("login");
    } else {
      setAuthMessage("");
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
  if (!user) {
    if (currentPage === "startup") return <LoginForm changePage={setCurrentPage} />;
    if (currentPage === "login") return <LoginForm changePage={setCurrentPage} />;
    if (currentPage === "register") return <RegisterForm changePage={setCurrentPage} />;
  }

  switch (currentPage) {
    case "investors":
      return <InvestorsPage changePage={handlePageChange} />;
    case "market":
      return <MarketPage changePage={handlePageChange} />;
    case "startup":
      return <StartupApp changePage={handlePageChange} />;
    case "reports":
      return <Reports changePage={handlePageChange} />;
    case "profile":
      return <UserProfile />;
    default:
      return null;
  }
};

  return (
    <div className="page-container">
      <header className="navbar">
        <div className="nav-center">
          <button className="nav-btn" onClick={() => handlePageChange("market")}>Ринок</button>
          <button className="nav-btn" onClick={() => handlePageChange("startup")}>Мій стартап</button>
         
          <button className="nav-btn" onClick={() => handlePageChange("investors")}>Інвестори</button>
          <button className="nav-btn" onClick={() => handlePageChange("reports")}>Головна</button>
        </div>

        <div className="nav-auth">
  {!user ? (
    <>
      <button className="nav-btn" onClick={() => handlePageChange("login")}>Увійти</button>
      <button className="nav-btn" onClick={() => handlePageChange("register")}>Реєстрація</button>
    </>
  ) : (
    <>
      <button className="nav-btn" onClick={() => handlePageChange("profile")}>Профіль</button>
      <button
        className="nav-btn"
        onClick={() => {
          signOut(auth);
          setCurrentPage("login");
          setAuthMessage("");
        }}
      >
        Вийти
      </button>
    </>
  )}
</div>
      </header>

      {authMessage && <p style={{ color: "red", textAlign: "center" }}>{authMessage}</p>}

      {renderPage()}
    </div>
  );
}

export default App;
