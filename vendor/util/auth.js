import axios from "axios";
import { AsyncStorage } from "react-native";

exports.signup = async (
  username,
  email,
  password,
  confirmPassword,
  vendorType,
  lat,
  lng,
  phone
) => {
  let status, data;

  try {
    const response = await axios.post(
      "https://store-to-door13.herokuapp.com/vendor/signup",
      {
        username,
        email,
        password,
        confirmPassword,
        vendorType,
        lat,
        lng,
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

exports.login = async (email, password) => {
  console.log(email);
  let status, data;
  try {
    const response = await axios.post(
      "https://store-to-door13.herokuapp.com/vendor/login",
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
    await AsyncStorage.setItem("type", "vendor");
    return { data, status };
  } catch (error) {
    console.log(error);
  }
};

exports.logout = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("id");
  await AsyncStorage.removeItem("username");
  await AsyncStorage.removeItem("email");
  await AsyncStorage.removeItem("type");
};
