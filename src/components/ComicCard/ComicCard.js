import React from "react";
import { Link } from "react-router-dom";
import "./ComicCard.css";

function ComicCard({ comic, season }) {
  return (
    <div className="comic-card">
      <Link to={`/comic/${comic._id}`} className="comic-cover-container">
        <div className="comic-cover-flipper">
          <img src={comic.cover} alt={comic.title} className="comic-cover" />
          <div className="comic-cover-overlay">
            <span>Ver detalles</span>
          </div>
        </div>
      </Link>
      <h3>{comic.title}</h3>
      <p className="vote-container">{comic.rating} {season==="libre" && <span className="creator-container">{comic.creator} </span>}</p>
    </div>
  );
}

export default ComicCard;
