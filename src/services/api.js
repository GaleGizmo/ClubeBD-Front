import axios from 'axios';

const API_URL = 'http://localhost:8000';


export const APIHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
   
  };

export const api = axios.create({
  baseURL: API_URL,
  headers: APIHeaders,
});

export const getComics = async () => {
  const response = await api.get('/comics');
  return response.data;
};

export const getComicDetails = async (comicId) => {
  const response = await api.get(`/comics/${comicId}`);
  return response.data;
};

export const rateComic = async (comicId, userId, rating) => {
  const response = await api.post(`/comics/${comicId}/rate`, { userId, rating });
  return response.data;
};

export const updateRating = async (comicId, userId, rating) => {
  const response = await api.put(`/comics/${comicId}/rate`, { userId, rating });
  return response.data;
};

export const getUserRatings = async (userId) => {
 
  const response = await api.post(`/users/ratings`, {userId});
 
  return response.data;
};

export const addComment = async (comicId, userId, commentText) => {
  const response = await api.post(`/comments/${comicId}`, { userId, commentText });
  return response.data;
};

export const getComments = async (comicId) => {
  const response = await api.get(`/comments/comic/${comicId}`);
  return response.data;
};

export const updateComment = async (commentId, userId, commentText) => {
  const response = await api.put(`/comments/${commentId}`, { userId, commentText });
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
    const response = await api.post('/users/login', { userId });
    return response.data.user;
  };
  
  export const logoutUser = async (userId) => {
    const response = await api.post('/users/logout', { userId });
    return response.data.user;
  };