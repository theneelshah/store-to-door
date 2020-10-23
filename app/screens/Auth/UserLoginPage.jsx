import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "../../components/input";
import { loginUser } from "../../util/auth";

export default class UserLoginPage extends Component {
  state = {
    email: "",
    emailError: true,
    password: "",
    passwordError: true,
  };

  validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (re.test(email.toLowerCase())) this.setState({ emailError: false });
    else this.setState({ emailError: true });
  };

  validatePassword = (password) => {
    if (password.length < 8) this.setState({ passwordError: true });
    else
      this.setState({ passwordError: false }, () => {
        console.log(this.state.passwordError);
      });
  };

  updateEmail = (email) => {
    this.setState({ email }, () => {
      this.validateEmail(this.state.email);
    });
  };

  updatePassword = (password) => {
    this.setState({ password }, () => {
      this.validatePassword(this.state.password);
    });
  };

  onSubmit = () => {
    const { email, password } = this.state;
    loginUser(email, password);
  };

  onLoginPress = () => {
    const { emailError, passwordError } = this.state;

    if (!emailError && !passwordError) {
      this.onSubmit();
    } else {
      ToastAndroid.show("Enter all the fields correctly", ToastAndroid.LONG);
    }
  };

  render() {
    const { email, emailError, password, passwordError } = this.state;
    return (
      <View style={styles.form}>
        <Text style={styles.h1}>Store TO Door</Text>

        <View style={styles.inputs}>
          <Input
            type="email-address"
            placeholder="Email"
            error={emailError}
            value={email}
            update={this.updateEmail}
            required
          />
          <Input
            type="visible-password"
            placeholder="Password"
            error={passwordError}
            value={password}
            update={this.updatePassword}
            required
          />
          <TouchableOpacity style={styles.login} onPress={this.onLoginPress}>
            <Text>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    backgroundColor: "black",
  },
  h1: {
    fontSize: 45,
    textAlign: "center",
    marginVertical: 40,
    color: "white",
  },
  inputs: {
    height: 375,
    alignItems: "center",
    justifyContent: "space-around",
    marginHorizontal: 40,
  },
  login: {
    // padding: "10px",
    backgroundColor: "#dfe2ff",
    color: "rgb(255,255,255)",
    width: "30%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});
