import React, { useEffect, useState, useMemo } from "react";
import { getComics } from "../../services/api";
import ComicCard from "../ComicCard/ComicCard";
import "./LandingPage.css";
import Loader from "../Loader/Loader";
import { useParams } from "react-router-dom";
import RadialSortButton from "../RadialSortButton/RadialSortButton";
import { stripArticle } from "../../utils/stripArticle";


function LandingPage() {
  const [comics, setComics] = useState([]);
  const [sortBy, setSortBy] = useState("rating");
  const [noComicsMessage, setNoComicsMessage] = useState(false);
  const { season } = useParams();

  useEffect(() => {
    async function fetchComics() {
      const fetchedComics = await getComics(season || "25-26");
      if (fetchedComics === 404) {
        setNoComicsMessage(true);
      } else {
        const sortedComics = fetchedComics.sort((a, b) => b.rating - a.rating);
        setComics(sortedComics);
      
        setNoComicsMessage(false);
      }
    }
    fetchComics();
  }, [season]);
  const sortedComics = useMemo(() => {
    return [...comics].sort((a, b) => {
      if (sortBy === "rating") return b.average_rating - a.average_rating;
      if (sortBy === "title") return  stripArticle(a.title).localeCompare(stripArticle(b.title), 'es', { sensitivity: 'base' })
      if (sortBy === "date") return new Date(b.addingDate) - new Date(a.addingDate);
      return 0;
    });
  }, [comics, sortBy]);
  if (!comics.length) {
    return <Loader />;
  }

  return (
    <div className="landing-page">
      {!noComicsMessage ? (
        <div className="comics-grid">
          {sortedComics.map((comic) => (
            <ComicCard key={comic._id} comic={comic} season={season} />
          ))}
        </div>
      ) : (
        <div className="user-select no-users">Non hai cómics dispoñibles</div>
      )}
      <RadialSortButton onSortChange={setSortBy} activeSort={sortBy}/>
    </div>
  );
}

export default LandingPage;
