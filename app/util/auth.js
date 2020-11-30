import axios from "axios";
import { AsyncStorage } from "react-native";

exports.signup = async (username, email, password, confirmPassword, phone) => {
  let status, data;

  try {
    const response = await axios.post(
      "https://store-to-door13.herokuapp.com/user/signup",
      {
        username,
        email,
        password,
        confirmPassword,
        phone,
      }
    );
    data = response.data;
    status = response.status;
    return { data, status };
  } catch (error) {
    const { data, status } = error.response;
    return { data, status };
  }
};

const loginUser = async (email, password) => {
  console.log(email);
  let status, data;
  try {
    const response = await axios.post(
      "https://store-to-door13.herokuapp.com/user/login",
      {
        email,
        password,
      }
    );
    data = response.data;
    status = response.status;
  } catch (error) {
    const { data, status } = error.response;
    // data = error.response.data;
    // status = error.response.status;
    // console.log(data);
    return { data, status };
  }

  try {
    const { token, user } = data;
    const { _id, username, email } = user;
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("id", _id);
    await AsyncStorage.setItem("username", username);
    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("type", "customer");
    return { data, status };
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = async () => {
  console.log("logoutuser");
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("id");
  await AsyncStorage.removeItem("username");
  await AsyncStorage.removeItem("email");
  await AsyncStorage.removeItem("type");
};

const isLoggedIn = async () => {
  const token = await AsyncStorage.getItem("token");
  const id = await AsyncStorage.getItem("id");
  const username = await AsyncStorage.getItem("username");
  const email = await AsyncStorage.getItem("email");
  const type = await AsyncStorage.getItem("type");

  if (!token || !id || !username || !email || !type) return false;

  return true;
};

export { loginUser, logoutUser };
