import React, { useEffect, useState } from 'react';
import { getComics } from '../../services/api';
import ComicCard from '../ComicCard/ComicCard';
import './LandingPage.css';

function LandingPage() {
  const [comics, setComics] = useState([]);

  useEffect(() => {
    async function fetchComics() {
      const fetchedComics = await getComics();
      const sortedComics = fetchedComics.sort((a, b) => b.rating - a.rating);
      setComics(sortedComics);
      console.log(sortedComics);
    }
    fetchComics();
  }, []);

  return (
    <div className="landing-page">
      <h1>Lecturas Clube BD 2023-24</h1>
      <div className="comics-grid">
        {comics.map(comic => (
          <ComicCard key={comic._id} comic={comic} />
        ))}
      </div>
    </div>
  );
}

export default LandingPage;