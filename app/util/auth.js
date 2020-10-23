import axios from "axios";

const loginUser = async (email, password) => {
  console.log(email);
  axios
    .post("192.168.42.42:5949/user/login", {
      email,
      password,
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
  // console.log(user);
};

export { loginUser };
