import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComicDetails, getComments } from "../../services/api";
import RatingSystem from "../RatingSystem/RatingSystem";
import CommentSection from "../CommentSection/CommentSection";
import { useAuth } from "../../context/AuthContext";
import { TiArrowBackOutline } from "react-icons/ti";
import "./ComicDetail.css";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

function ComicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [comments, setComments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const comicData = await getComicDetails(id);
      setComic(comicData);
    
      const commentsData = await getComments(id);
      setComments(commentsData.comments);
    };
    fetchData();
  }, [id]);

  function getYear(dateString) {
    return new Date(dateString).getFullYear();
  }

  if (!comic) return <Loader />;

  return (
    <div className="comic-detail">
      <div className="title-container">
        <h1>{comic.title}</h1>{" "}
      </div>
      <div className="comic-content">
        <span className="back-button" onClick={() => navigate(-1)}>
          <TiArrowBackOutline />{" "}
        </span>
        <div className="comic-cover">
          <img src={comic.cover} alt={comic.title} />{" "}
        </div>
        <div className="comic-info">
          <h2>
            <span className="tag"> Guión:</span>{" "}
            {Array.isArray(comic.writers)
              ? comic.writers.join(", ")
              : comic.writers}
          </h2>
          <h2>
            <span className="tag">Debuxo:</span>{" "}
            {Array.isArray(comic.artists)
              ? comic.artists.join(", ")
              : comic.artists}
          </h2>
          {comic.colorists && comic.colorists.length > 0 && (
            <h2>
              <span className="tag"> Cor:</span>{" "}
              {Array.isArray(comic.colorists)
                ? comic.colorists.join(", ")
                : comic.colorists}
            </h2>
          )}
          <h3>
            <span className="tag">Tít. orix. :</span> {comic.original_title}
          </h3>
          <h3>
            <span className="tag">Editor:</span> {comic.publisher}
          </h3>
          <h3>
            <span className="tag">Ano de publicación:</span>{" "}
            {getYear(comic.published_date)}
          </h3>
          <h3>
            <span className="tag"> Xéneros:</span>{" "}
            {Array.isArray(comic.genres)
              ? comic.genres.join(", ")
              : comic.genres}
          </h3>
          <h3>
            <span className="tag">Páxinas:</span> {comic.pages}
          </h3>
          <p>{comic.synopsis}</p>
          {user && (
            <RatingSystem
              comicId={comic._id}
              userId={user._id}
              initialRating={comic.average_rating}
              numberOfVotes={comic.ratings.length}
            />
          )}{" "}
        </div>
      </div>
      <CommentSection
        comicId={comic._id}
        comments={comments}
        setComments={setComments}
      />{" "}
    </div>
  );
}

export default ComicDetail;
