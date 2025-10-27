import "./Header.css";
import React, { useState } from "react";
import { useIsMobile } from "../../hooks/IsMobile"; 
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ logout }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile()  
  const seasons = ["25-26", "24-25", "libre"];
  const [actualSeason, setActualSeason] = useState(seasons[0]);
  const handleSeasonSelect = (season) => {
    setActualSeason(season);
    navigate(`/past-comics/${season}`); // Navegar a la temporada seleccionada
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <header>
      <button className={isMobile ? "add-form-button-mobile" : "add-form-button"}>
        <Link to={{ pathname: "/add-comic" }}>
          <span className={isMobile ? "add-form-button_text_mobile": "add-form-button_text" }>{isMobile ? "+":"ENGADIR"}</span>
        </Link>
      </button>
      {actualSeason && <h1>TERRA {actualSeason.toLocaleUpperCase()}</h1>}
      <nav>
        <div className="seasons-dropdown">
          <label htmlFor="season-select">
           
          </label>
          <select
            id="season-select"
            onChange={(e) => handleSeasonSelect(e.target.value)} // Manejar selección de temporada
          >
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season.toLocaleUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <IoLogOutOutline />
        </button>
      </nav>
    </header>
  );
};

export default Header;
