import "./AddComicForm.css";
import { useDropzone } from "react-dropzone";
import React, { useState } from "react";
import { addComic } from "../../services/api";
import { toast } from "react-toastify";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { TiArrowBackOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";


const AddComicForm = () => {
 
  
  const initialData = {
    title: "",
    original_title: "",
    writers: [""],
    artists: [""],
    colorists: [""],
    publisher: "",
    published_date: "2000-01-01",
    genres: [""],
    cover: null,
    synopsis: "",
    pages: "",
    club_season: "libre",
    created_by: null,
    average_rating: 0,
    ratings: [],
    comments_count: 0,
  };
  const navigate = useNavigate();
  const [comicData, setComicData] = useState(initialData);
  const [coverPreview, setCoverPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cleanedData, setCleanedData] = useState(null);

  const validateDate = (dateString) => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    
    // Resetear las horas para comparar solo las fechas
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    // Comprobar que es una fecha válida y no es futura
    if (!(selectedDate instanceof Date && !isNaN(selectedDate))) {
      return { isValid: false, error: "Por favor, introduce unha data válida" };
    }
    
    if (selectedDate > today) {
      return { isValid: false, error: "A data non pode ser posterior á actual" };
    }
    
    return { isValid: true, error: null };
  };

  const cleanData = (data) => {
    const cleaned = { ...data };
    
    // Limpiar arrays opcionales
    ['colorists', 'genres'].forEach(field => {
      if (cleaned[field].length === 1 && cleaned[field][0] === '') {
        delete cleaned[field];
      } else if (cleaned[field].length > 0) {
        cleaned[field] = cleaned[field].filter(item => item.trim() !== '');
        if (cleaned[field].length === 0) {
          delete cleaned[field];
        }
      }
    });

    // Eliminar campos opcionales vacíos
    if (!cleaned.pages || cleaned.pages === '') {
      delete cleaned.pages;
    }

    return cleaned;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación especial para la fecha
    if (name === 'published_date') {
      if (!validateDate(value)) {
        setError(prev => ({
          ...prev,
          published_date: "Por favor, introduce unha data válida"
        }));
      } else {
        setError(prev => ({
          ...prev,
          published_date: null
        }));
      }
    }
    
    setComicData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    if (value && name !== 'published_date') {
      setError((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleArrayChange = (e, field) => {
    const { value, dataset } = e.target;
    const index = dataset.index;

    setComicData((prevData) => {
      const updatedArray = [...prevData[field]];
      updatedArray[index] = value;

      // Limpia el error si todos los elementos tienen valores
      if (updatedArray.every((item) => item.trim() !== "")) {
        setError((prevErrors) => ({
          ...prevErrors,
          [field]: null,
        }));
      }

      return { ...prevData, [field]: updatedArray };
    });
  };

  const handleAddToArrayField = (field) => {
    setComicData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], ""],
    }));
  };

  const handleRemoveFromArray = (field, index) => {
    setComicData((prevData) => {
      const updatedArray = prevData[field].filter((_, i) => i !== index); // Elimina el elemento en el índice especificado

      // Actualiza el estado y limpia el error si el array resultante está lleno
      setError((prevErrors) => ({
        ...prevErrors,
        [field]:
          updatedArray.length > 0 &&
          updatedArray.every((item) => item.trim() !== "")
            ? null
            : prevErrors[field],
      }));

      return { ...prevData, [field]: updatedArray };
    });
  };

  const validateField = (name, value) => {
    // Validar arrays como `writers` y `artists`
    if (
      (name === "writers" || name === "artists") &&
      value.some((item) => !item)
    ) {
      setError((prevErrors) => ({
        ...prevErrors,
        [name]: "Este campo é obrigatorio.",
      }));
    } else if (!value) {
      setError((prevErrors) => ({
        ...prevErrors,
        [name]: "Este campo é obrigatorio.",
      }));
    }
  };

  const validateFields = () => {
    const newErrors = {};

    // Validar campos obligatorios normales
    const requiredFields = [
      "title",
      "original_title",
      "publisher",
      "published_date",
      "synopsis",
      "club_season"
    ];
    if (comicData.published_date) {
      const dateValidation = validateDate(comicData.published_date);
      if (!dateValidation.isValid) {
        newErrors.published_date = dateValidation.error;
      }
    }
    requiredFields.forEach((field) => {
      if (!comicData[field]) {
        newErrors[field] = "Este campo é obrigatorio.";
      }
    });

    // Validar que todos los elementos en `writers` y `artists` estén llenos
    if (comicData.writers.some((writer) => !writer)) {
      newErrors.writers = "Este campo é obrigatorio.";
    }
    if (comicData.artists.some((artist) => !artist)) {
      newErrors.artists = "Este campo é obrigatorio.";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value); // Valida solo el campo en foco
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos los campos obligatorios antes de abrir el modal

    if (validateFields()) {
      const cleaned = cleanData(comicData);
      setCleanedData(cleaned);
      setIsModalOpen(true);
    }
  };

  const confirmSubmit = async () => {
    try {
      const formData = new FormData();
      Object.keys(cleanedData).forEach((key) => {
        if (Array.isArray(cleanedData[key])) {
          cleanedData[key].forEach((value) => formData.append(key, value));
        } else {
          formData.append(key, cleanedData[key]);
        }
      });

      const response = await addComic(formData);
      toast.success(response.message);
      setComicData(initialData);
      setCleanedData(null)
      setCoverPreview(null);
      setError({});
      setIsModalOpen(false);
      navigate("/comic/" + response.newComic._id); // Redirigir al usuario a la página del cómic recién creado"); 
    } catch (err) {
      toast.error("Error ao engadir o cómic");
    }
  };
  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError((prev) => ({
        ...prev,
        cover:
          "Tipo de arcquivo non válido. So se permiten imaxes JPEG ou PNG.",
      }));
      return;
    }
    const file = acceptedFiles[0];
    if (file.size > 2 * 1024 * 1024) {
      setError((prev) => ({
        ...prev,
        cover: "O arquivo supera o tamaño máximo de 2MB.",
      }));
      return;
    }
    if (file) {
      setComicData((prevData) => ({
        ...prevData,
        cover: file, // Almacena el archivo en el estado
      }));
      setCoverPreview(URL.createObjectURL(file));
      setError(null);
    }
  };
  const removeImage = () => {
    setComicData((prevData) => ({
      ...prevData,
      cover: null,
    }));
    setCoverPreview(null); // Limpiar la previsualización
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
  });

  return (
    <>
    <span className="back-button" onClick={() => navigate(-1)}>
          <TiArrowBackOutline />{" "}
        </span>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título: <span style={{color:"red"}}>*</span></label>
          <input
            type="text"
            name="title"
            value={comicData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {error?.title && <p className="error">{error.title}</p>}
        </div>

        <div>
          <label>Título Orixinal: <span style={{color:"red"}}>*</span></label>
          <input
            type="text"
            name="original_title"
            value={comicData.original_title}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {error?.original_title && (
            <p className="error">{error.original_title}</p>
          )}
        </div>

        <div>
          <label>Guión: <span style={{color:"red"}}>*</span></label>
          {comicData.writers.map((writer, index) => (
            <div key={index} className="array-field">
              <input
                type="text"
                data-index={index}
                value={writer}
                onChange={(e) => handleArrayChange(e, "writers")}
                onBlur={(e) => validateField("writers", comicData.writers)}
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFromArray("writers", index)}
                  className="form-button remove-btn"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button className="form-button add-button"
            type="button"
            onClick={() => handleAddToArrayField("writers")}
            disabled={!comicData.writers[0]} 
          >
            +
          </button>{" "}
          {error?.writers && <p className="error">{error.writers}</p>}
        </div>

        <div>
          <label>Debuxo: <span style={{color:"red"}}>*</span></label>
          {comicData.artists.map((artist, index) => (
            <div key={index} className="array-field">
              <input
                type="text"
                data-index={index}
                value={artist}
                onChange={(e) => handleArrayChange(e, "artists")}
                onBlur={(e) => validateField("artists", comicData.artists)}
                required
              />
              {index > 0 && ( 
                <button
                  type="button"
                  onClick={() => handleRemoveFromArray("artists", index)}
                  className="remove-btn"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button className="form-button add-button"
            type="button"
            onClick={() => handleAddToArrayField("artists")}
            disabled={!comicData.artists[0]}
          >
            +
          </button>{" "}
          {error?.artists && <p className="error">{error.artists}</p>}
        </div>

        <div>
          <label>Cor:</label>
          {comicData.colorists.map((colorist, index) => (
            <div key={index} className="array-field">
              <input
                type="text"
                data-index={index}
                value={colorist}
                onChange={(e) => handleArrayChange(e, "colorists")}
                onBlur={(e) => validateField("colorists", comicData.colorists)}
                required
              />
              {index > 0 && ( 
                <button
                  type="button"
                  onClick={() => handleRemoveFromArray("colorists", index)}
                  className="remove-btn"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button className="form-button add-button"
            type="button"
            onClick={() => handleAddToArrayField("colorists")}
            disabled={!comicData.colorists[0]}
          >
            +
          </button>
        </div>

        <div>
          <label>Editorial: <span style={{color:"red"}}>*</span></label>
          <input
            type="text"
            name="publisher"
            value={comicData.publisher}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {error?.publisher && <p className="error">{error.publisher}</p>}
        </div>

        <div>
          <label>Data de Publicación: <span style={{color:"red"}}>*</span></label>
          <input
          type="date"
          name="published_date"
          value={comicData.published_date}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          max={new Date().toISOString().split('T')[0]} // Impide seleccionar fechas futuras
        />
          {error?.published_date && (
            <p className="error">{error.published_date}</p>
          )}
        </div>

        <div>
          <label>Xénero/s:</label>
          {comicData.genres.map((genre, index) => (
            <div key={index} className="array-field">
              <input
                type="text"
                data-index={index}
                value={genre}
                onChange={(e) => handleArrayChange(e, "genres")}
                onBlur={(e) => validateField("genres", comicData.genres)}
                required
              />
              {index > 0 && ( 
                <button
                  type="button"
                  onClick={() => handleRemoveFromArray("genres", index)}
                  className="remove-btn"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button className="form-button add-button"
            type="button"
            onClick={() => handleAddToArrayField("genres")}
            disabled={!comicData.genres[0]}
          >
            +
          </button>
        </div>

        <div>
          <label>Portada:</label>
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Solta a imaxe eiquí...</p>
            ) : (
              <p>Arrastra e solta a imaxe ou clica para a seleccionar</p>
            )}
          </div>
          {error?.cover && <p className="error">{error.cover}</p>}{" "}
          {/* Mostrar el error si el archivo es demasiado grande */}
          {coverPreview && (
            <div className="cover-container" onClick={removeImage}>
              <img src={coverPreview} alt="Preview" className="cover-preview" />
              <div className="remove-overlay">Eliminar Imaxe</div>
            </div>
          )}
        </div>

        <div>
          <label>Sinopsis: <span style={{color:"red"}}>*</span></label>
          <textarea
            name="synopsis"
            value={comicData.synopsis}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {error?.synopsis && <p className="error">{error.synopsis}</p>}
        </div>

        <div>
          <label>Páxinas:</label>
          <input
            type="number"
            name="pages"
            value={comicData.pages}
            onChange={handleChange}
          />
        </div>
        <div>
        <label>Tempada do Clube: <span style={{color:"red"}}>*</span></label>
        <select
          name="club_season"
          value={comicData.club_season}
          onChange={handleChange}
          onBlur={handleBlur}
          className="form-select"
          required
        >
          <option value="libre">Libre</option>
          <option value="24-25">24-25</option>
        </select>
        {error?.club_season && (
            <p className="error">{error.club_season}</p>
          )}
      </div>
        <button className="form-button submit" onClick={handleSubmit}>
          Engadir Cómic
        </button>
      </form>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {setIsModalOpen(false);
         setCleanedData(null)}}
        onConfirm={confirmSubmit}
        comicData={cleanedData}
        coverPreview={coverPreview}
      />
    </>
  );
};

export default AddComicForm;
