import axios from "axios";

const API_URL = "http://localhost:3001/";

const register = (user_name, email, password) => {
  return axios.post(API_URL + "signup", {
    user_name,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then((response) => {
      console.log(response)
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        // localStorage.setItem("userId", JSON.stringify(response.data.userId));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  register,
  login,
  logout,
};