import React from "react";
import "./ConfirmationModal.css";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  comicData,
  coverPreview,
}) => {
  if (!isOpen) return null;
console.log(comicData)
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Confirmas os datos?</h2>
       
        <div className="modal-data">
          <div>
            <p>
              <strong>Título:</strong> {comicData.title}
            </p>
            <p>
              <strong>Título Orixinal:</strong> {comicData.original_title}
            </p>
            <p>
              <strong>Guión:</strong> {comicData.writers.join(', ')}
            </p>
            <p>
              <strong>Debuxo:</strong> {comicData.artists.join(', ')}
            </p>
            <p>
              <strong>Cor:</strong> {comicData.colorists.join(', ')}
            </p>
            <p>
              <strong>Editorial:</strong> {comicData.publisher}
            </p>

            <p>
              <strong>Data Publicación:</strong> {comicData.published_date}
            </p>
            <p>
              <strong>Xénero:</strong> {comicData.genres}
            </p>
            <p><strong>Portada: </strong>{coverPreview ? (<p><img
              src={coverPreview}
              alt="Cover Preview"
              className="cover-preview"
            /> </p>) : (<span> Sen portada </span>) } 

            </p>
            <p>
              <strong>Sinopsis:</strong> {comicData.synopsis}
            </p>
            <p>
              <strong>Páxinas:</strong> {comicData.pages}
            </p>
          </div>
          <div className="modal-buttons">
            <button className="form-button add-button"  onClick={onConfirm}>Confirmar</button>
            <button className="form-button add-button" onClick={onClose}>Cancelar</button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
