import React, { useEffect, useState } from 'react';
import { getComics } from '../../services/api';
import ComicCard from '../ComicCard/ComicCard';
import './LandingPage.css';
import Loader from '../Loader/Loader';
import { useParams } from 'react-router-dom';

function LandingPage() {
  const [comics, setComics] = useState([]);
  const { season } = useParams();

  useEffect(() => {
    async function fetchComics() {
      const fetchedComics = await getComics(season || "24-25");
      const sortedComics = fetchedComics.sort((a, b) => b.rating - a.rating);
      setComics(sortedComics);
      console.log(sortedComics);
    }
    fetchComics();
  }, [season]);

  if  (!comics.length) {
    return <Loader/>
  }

  return (
    <div className="landing-page">
     
      <div className="comics-grid">
        {comics.map(comic => (
          <ComicCard key={comic._id} comic={comic} />
        ))}
      </div>
    </div>
  );
}

export default LandingPage;