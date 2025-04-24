import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserRatings, rateComic, updateRating } from "../../services/api";
import "./RatingSystem.css";

function RatingSystem({ comicId, userId, initialRating, numberOfVotes }) {
  const [rating, setRating] = useState(initialRating);
  const [newRating, setNewRating] = useState(5);
  const [yourVote, setYourVote] = useState(null);

  // Función para actualizar userData en localStorage
  const updateLocalStorageUserData = (updatedRatings) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user.rated_comics = updatedRatings;
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  // useEffect para inicializar yourVote desde localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.rated_comics) {
      const userRating = userData.rated_comics.find(
        (comic) => comic.comic_id === comicId
      );
      if (userRating) {
        setYourVote(userRating.rating);
      }
    }
  }, [comicId]);

  // useEffect para obtener y actualizar ratings del usuario
  useEffect(() => {
    const fetchAndSetUserRatings = async () => {
      try {
        const response = await getUserRatings(userId);
        const userRating = response.find((comic) => comic.comic_id === comicId);
        if (userRating) {
          setYourVote(userRating.rating);
        }
        // Actualizar userData en localStorage
        updateLocalStorageUserData(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndSetUserRatings();
  }, [rating, userId, comicId]); // Incluye comicId en las dependencias

  const handleRating = async () => {
    try {
      if (yourVote !== null) {
        const updateResponse = await updateRating(comicId,  newRating);
          setRating(updateResponse.average_rating);
          toast.success("Voto modificado!");}
          else {
      const response = await rateComic(comicId,  newRating);
      setRating(response.average_rating);
      toast.success("Voto engadido!");}
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // El usuario ya ha votado, intenta actualizar
        try {
          const updateResponse = await updateRating(comicId,  newRating);
          setRating(updateResponse.average_rating);
          toast.success("Voto modificado!");
        } catch (updateError) {
          toast.error("Erro cambiando voto: " + updateError.message);
        }
      } else {
        toast.error("Erro mandando voto: " + error.message);
      }
    }
  };

  const incrementRating = () => {
    setNewRating((prev) => {
      const nextValue = prev < 10 ? prev + 1 : 10;
      return nextValue;
    });
  };

  const decrementRating = () => {
    setNewRating((prev) => {
      const nextValue = prev > 0 ? prev - 1 : 0;
      return nextValue;
    });
  };

  return (
    <div className="rating-system">
      <div className="rating-data">
        <p>
          Puntuación: <span className="vote-container vote-figure">{rating.toFixed(1)}</span> <small>({numberOfVotes} votos)</small>
        </p>
        {yourVote !== null ? (
          <p>O teu voto: <span className={yourVote > 0 ? "yes-read" : "no-read"}>{yourVote > 0 ? yourVote : "Non lido"}</span></p>
        ) : (
          <p className="no-read">Non votado</p>
        )}{" "}
      </div>
      <div className="rating-controls">
        <button className="rating-button control-button" onClick={decrementRating}>
          -
        </button>
        <button className="rating-button selected-rate" onClick={handleRating}>
          {newRating === 0 ? "N/L" : Math.round(newRating)}
        </button>
        <button className="rating-button control-button" onClick={incrementRating}>
          +
        </button>
      </div>
    </div>
  );
}

export default RatingSystem;
