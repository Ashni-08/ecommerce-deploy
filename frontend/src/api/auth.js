import axios from "axios";

const BASE_URL = "https://ecommerce-deploy-production.up.railway.app/api/users";

// REGISTER
export const registerUser = async (data) => {
  const response = await axios.post(`${BASE_URL}/register`, data);
  return response.data;
};

// LOGIN
export const loginUser = async (data) => {
  const response = await axios.post(`${BASE_URL}/login`, data);
  return response.data;
};
