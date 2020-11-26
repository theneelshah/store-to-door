import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "../../components/input";
import { login } from "../../util/auth";

export default class Login extends Component {
  state = {
    email: "",
    emailError: true,
    password: "",
    passwordError: true,
    isLoading: false,
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

  onLogin = async () => {
    const { email, password } = this.state;
    this.setState({ isLoading: true });
    const response = await login(email, password);
    const { data, status } = response;
    ToastAndroid.show(
      "Logging you in. PLease wait patiently",
      ToastAndroid.SHORT
    );
    if (status === 200) {
      this.props.navigation.navigate("App");
      ToastAndroid.show("Logged In", ToastAndroid.LONG);
    }
    if (status === 400) {
      this.setState({
        email: "",
        emailError: true,
        password: "",
        passwordError: true,
        isLoading: false,
      });
      ToastAndroid.show(data.message);
    }
    console.log(response);
  };

  render() {
    const {
      email,
      emailError,
      password,
      passwordError,
      isLoading,
    } = this.state;
    return (
      <View style={styles.form}>
        <Text> Login </Text>

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

        <TouchableOpacity
          style={styles.login}
          onPress={this.onLogin}
          disabled={isLoading}
        >
          <Text>Login</Text>
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
  login: {
    marginVertical: 30,
    backgroundColor: "#dfe2ff",
    color: "rgb(255,255,255)",
    width: "30%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});
