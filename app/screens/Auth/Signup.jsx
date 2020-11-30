import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "../../components/input";
import { signup } from "../../util/auth";

export default class ServitorLoginPage extends Component {
  state = {
    username: "",
    usernameError: true,
    email: "",
    emailError: true,
    password: "",
    passwordError: true,
    confirmPassword: "",
    confirmPasswordError: true,
    phone: "",
    phoneError: true,
    isLoading: false,
  };

  validateUsername = (username) => {
    if (username.length > 3) this.setState({ usernameError: false });
    else this.setState({ usernameError: true });
  };

  updateUsername = (username) => {
    this.setState({ username }, () => {
      this.validateUsername(this.state.username);
    });
  };

  validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (re.test(email.toLowerCase())) this.setState({ emailError: false });
    else this.setState({ emailError: true });
  };

  updateEmail = (email) => {
    this.setState({ email }, () => {
      this.validateEmail(this.state.email);
    });
  };

  validatePassword = (password) => {
    if (password.length < 8) this.setState({ passwordError: true });
    else
      this.setState({ passwordError: false }, () => {
        console.log(this.state.passwordError);
      });
  };

  updatePassword = (password) => {
    console.log("valled");
    this.setState({ password }, () => {
      this.validatePassword(this.state.password);
    });
  };

  validateConfirmPassword = (cnfPassword) => {
    const { password } = this.state;
    console.log(cnfPassword);
    if (password === cnfPassword)
      this.setState({ confirmPasswordError: false });
    else this.setState({ confirmPasswordError: true });
  };

  updateConfirmPassword = (confirmPassword) => {
    this.setState({ confirmPassword }, () => {
      this.validateConfirmPassword(this.state.confirmPassword);
    });
  };

  validatePhoneNumber = (phone) => {
    if (phone.length < 10 || phone.length > 10)
      this.setState({ phoneError: true });
    else this.setState({ phoneError: false });
  };

  updatePhoneNumber = (phone) => {
    this.setState({ phone }, () => {
      this.validatePhoneNumber(this.state.phone);
    });
  };

  onSignup = async () => {
    const {
      confirmPassword,
      confirmPasswordError,
      email,
      emailError,
      password,
      passwordError,
      phone,
      phoneError,
      username,
      usernameError,
      isLoading,
    } = this.state;

    if (
      confirmPasswordError ||
      usernameError ||
      passwordError ||
      phoneError ||
      emailError
    ) {
      ToastAndroid.show(
        "Please enter all the fields correctly",
        ToastAndroid.SHORT
      );
    } else {
      this.setState({ isLoading: true });
      ToastAndroid.show("Please wait patiently", ToastAndroid.SHORT);
      const response = await signup(
        username,
        email,
        password,
        confirmPassword,
        phone
      );
      const { data, status } = response;
      console.log(status);
      console.log(response);
      if (status === 200) {
        ToastAndroid.show(
          "You have created an account! Please login to continue",
          ToastAndroid.LONG
        );

        this.props.navigation.navigate("UserLogin");
      }
      if (status == 400) {
        const { message } = data;
        // console.log(status);
        ToastAndroid.show(message, ToastAndroid.LONG);
        this.setState({
          username: "",
          usernameError: true,
          email: "",
          emailError: true,
          password: "",
          passwordError: true,
          confirmPassword: "",
          confirmPasswordError: true,
          phone: "",
          phoneError: true,
          isLoading: false,
        });
      }
    }
  };

  render() {
    const {
      confirmPassword,
      confirmPasswordError,
      email,
      emailError,
      password,
      passwordError,
      phone,
      phoneError,
      username,
      usernameError,
      isLoading,
    } = this.state;
    return (
      <View style={styles.form}>
        <Text>Login Page</Text>

        <Input
          type="default"
          placeholder="Username"
          value={username}
          error={usernameError}
          update={this.updateUsername}
          required
          disabled={isLoading ? true : false}
        />

        <Input
          type="email-address"
          placeholder="Email"
          value={email}
          error={emailError}
          update={this.updateEmail}
          required
          disabled={isLoading ? true : false}
        />

        <Input
          type="visible-password"
          placeholder="Password"
          value={password}
          error={passwordError}
          update={this.updatePassword}
          required
          disabled={isLoading ? true : false}
        />

        <Input
          type="visible-password"
          placeholder="Confirm Password"
          update={this.updateConfirmPassword}
          value={confirmPassword}
          error={confirmPasswordError}
          required
          disabled={isLoading ? true : false}
        />

        <Input
          type="phone-pad"
          placeholder="Phone number"
          update={this.updatePhoneNumber}
          value={phone}
          error={phoneError}
          required
          disabled={isLoading ? true : false}
        />

        <TouchableOpacity
          style={styles.signup}
          onPress={this.onSignup}
          disabled={isLoading}
        >
          <Text>Signup</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    backgroundColor: "black",
  },
  signup: {
    margin: 20,
    backgroundColor: "#dfe2ff",
    color: "rgb(255,255,255)",
    width: "30%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});
