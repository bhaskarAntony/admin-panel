// apiService.js
import axios from 'axios';

const BASE_URL = 'https://api.be-practical.com/api'; // Replace with your API endpoint

export const createCourse = async (courseData) => {
  try {
    const response = await axios.post(`${BASE_URL}/allcourses`, courseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateCourse = async (courseData, id) => {
  try {
    const response = await axios.put(`${BASE_URL}/allcourses/update/${id}`, courseData);
    return response.data;
  } catch (error) {
    alert(error)
    throw error;
  }
};

export const updateSubCourse = async (courseData, id, subCourseId) => {
  try {
    const response = await axios.put(`${BASE_URL}/allcourses/${id}/subcourses/${subCourseId}`, courseData);
    return response.data;
  } catch (error) {
    alert(error)
    throw error;
  }
};


