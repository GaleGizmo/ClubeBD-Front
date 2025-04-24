import axios from 'axios';




export const APIHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
   
  };
export const APIHeaders2={
  Accept: "application/json",
  "Content-Type": "multipart/form-data",
  "Access-Control-Allow-Origin": "*",
}
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL_LOCAL,
  headers: APIHeaders,
});

export const api2 = axios.create({
  baseURL: process.env.REACT_APP_API_URL_LOCAL,
  headers: APIHeaders2,
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ClubeBDtoken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api2.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ClubeBDtoken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const getComics = async (season) => {
  try {
    const response = await api.get(`/comics/${season}`);
    
    return response.data;
  } catch (err) {
    console.error("Error al recuperar los cómics:", err);
    return err.response.status
  }
};
export const addComic = async (comicData) => {
  try {
    
    const response = await api2.post('/comics/add-comic', comicData);
    return response.data;
  } catch (err) {
    console.error("Error al añadir el cómic:", err);
  }
};
export const getComicDetails = async (comicId) => {
  const response = await api.get(`/comics/details/${comicId}`);
  return response.data;
};

export const rateComic = async (comicId,  rating) => {
  const response = await api.post(`/comics/details/${comicId}/rate`, {  rating });
  return response.data;
};

export const updateRating = async (comicId,  rating) => {
  const response = await api.put(`/comics/details/${comicId}/rate`, {  rating });
  return response.data;
};

export const getUserRatings = async (userId) => {
 
  const response = await api.post(`/users/ratings`, {userId});
 
  return response.data;
};

export const addComment = async (comicId,  commentText) => {
  const response = await api.post(`/comments/${comicId}`, {  commentText });
  return response.data;
};

export const getComments = async (comicId) => {
  const response = await api.get(`/comments/comic/${comicId}`);
  return response.data;
};

export const updateComment = async (commentId,  commentText) => {
  const response = await api.put(`/comments/${commentId}`, {  commentText });
  return response.data;
};

export const deleteComment = async (commentId, userId) => {
  const response = await api.delete(`/comments/${commentId}`, { data: { userId } });
  return response.data;
};

export const getAvailableUsers = async () => {
    const response = await api.get('/users/available');
    
    return response.data.users;
  };
  
  export const loginUser = async (userId) => {
    const response = await api.post('/users/userlogin', { userId });
    return response.data.user;
  };
  export const doLogin = async (username, password) => {
    const response = await api.post('/users/login', { username, password });
    return response.data;
  };
  
  export const logoutUser = async (userId) => {
    const response = await api.post('/users/logout', { userId });
    return response.data.user;
  };

  export const addPasswordToExistingUser = async (userId, password, username) => {
    try {
      const response = await api.patch('/users/updateuser', { userId, password, username });
      
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Erro descoñecido";
      console.error("Error ao engadir contrasinal:", errorMsg);
      throw new Error(errorMsg);
    }
  }