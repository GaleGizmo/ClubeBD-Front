import React, { useEffect, useState } from "react";
import { getComics } from "../../services/api";
import ComicCard from "../ComicCard/ComicCard";
import "./LandingPage.css";
import Loader from "../Loader/Loader";
import { useParams } from "react-router-dom";

function LandingPage() {
  const [comics, setComics] = useState([]);
  const [noComicsMessage, setNoComicsMessage] = useState(false);
  const { season } = useParams();

  useEffect(() => {
    async function fetchComics() {
      const fetchedComics = await getComics(season || "24-25");
      if (fetchedComics === 404) {
        setNoComicsMessage(true);
      } else {
      const sortedComics = fetchedComics.sort((a, b) => b.rating - a.rating);
      setComics(sortedComics)
      setNoComicsMessage(false);}
      
    }
    fetchComics();
  }, [season]);

  if (!comics.length) {
    return <Loader />;
  }

  return (
    <div className="landing-page">
      {!noComicsMessage ? (
        <div className="comics-grid">
          {comics.map((comic) => (
            <ComicCard key={comic._id} comic={comic} season={season} />
          ))}
        </div>
      ) : (
        <div className="user-select no-users">Non hai cómics dispoñibles</div>
      )}
    </div>
  );
}

export default LandingPage;
