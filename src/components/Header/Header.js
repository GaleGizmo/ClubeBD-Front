import "./Header.css"
import React, { useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Header = ({ logout }) => {
    const navigate=useNavigate();

    const seasons=["24-25","23-24"]
    const [actualSeason, setActualSeason]=useState(seasons[0])
    const handleSeasonSelect = (season) => {
        setActualSeason(season);
        navigate(`/past-comics/${season}`); // Navegar a la temporada seleccionada
      };
  return (
    <header>
    { actualSeason && <h1>TERRA {actualSeason}</h1>}
      <nav>
      <div className="seasons-dropdown">
          <label htmlFor="season-select">Terras: </label>
          <select
            id="season-select"
            onChange={(e) => handleSeasonSelect(e.target.value)} // Manejar selección de temporada
          >
            
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div> 
        <button className="logout-button" onClick={logout}>
          <IoLogOutOutline />
        </button>
      </nav>
    </header>
  );
};

export default Header;
