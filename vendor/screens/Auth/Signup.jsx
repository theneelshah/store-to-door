import React, { Component } from "react";
import {
  Picker,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "../../components/input";
import { signup } from "../../util/auth";

export default class Signup extends Component {
  state = {
    username: "",
    usernameError: true,
    email: "",
    emailError: true,
    password: "",
    passwordError: true,
    confirmPassword: "",
    confirmPasswordError: true,
    phoneNumber: "",
    phoneNumberError: true,
    vendorType: "",
    vendorTypeError: true,
    lat: null,
    lng: null,
    isLoading: false,
  };

  async componentDidMount() {
    const options = {
      enableHighAccuracy: true,
      timeOut: 20000,
      maximumAge: 60 * 60 * 24,
    };

    navigator.geolocation.getCurrentPosition(
      this.geoSuccess,
      this.geoFailure,
      options
    );
  }

  geoSuccess = (pos) => {
    const { coords } = pos;
    const { latitude, longitude } = coords;
    this.setState({ lat: latitude, lng: longitude });
  };

  geoFailure = (err) => {
    console.log(err.message);
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

  updateVendorType = (value, index) => {
    console.log(value);
    console.log(index);
    this.setState({ vendorType: value }, () => {
      if (index === 0) this.setState({ vendorTypeError: true });
      else this.setState({ vendorTypeError: false });
    });
  };

  validatePhoneNumber = (phoneNumber) => {
    if (phoneNumber.length < 10 || phoneNumber.length > 10)
      this.setState({ phoneNumberError: true });
    else this.setState({ phoneNumberError: false });
  };

  updatePhoneNumber = (phoneNumber) => {
    this.setState({ phoneNumber }, () => {
      this.validatePhoneNumber(this.state.phoneNumber);
    });
  };

  onSignup = async () => {
    const {
      vendorType,
      vendorTypeError,
      email,
      emailError,
      password,
      passwordError,
      confirmPassword,
      confirmPasswordError,
      username,
      usernameError,
      phoneNumber,
      phoneNumberError,
      lat,
      lng,
    } = this.state;
    if (!lat || !lng) {
      ToastAndroid.show("Can't get location", ToastAndroid.SHORT);
    } else if (
      emailError ||
      usernameError ||
      passwordError ||
      confirmPasswordError ||
      phoneNumberError ||
      vendorTypeError
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
        vendorType,
        lat,
        lng,
        phoneNumber
      );
      const { data, status } = response;
      console.log(status);
      console.log(response);
      if (status === 200) {
        ToastAndroid.show(
          "You have created an account! Please login to continue",
          ToastAndroid.LONG
        );

        this.props.navigation.navigate("login");
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
          phoneNumber: "",
          phoneNumberError: true,
          vendorType: "",
          vendorTypeError: true,
          isLoading: false,
        });
      }
    }
  };

  render() {
    const {
      vendorType,
      email,
      emailError,
      password,
      passwordError,
      confirmPassword,
      confirmPasswordError,
      username,
      usernameError,
      phoneNumber,
      phoneNumberError,
      isLoading,
    } = this.state;

    return (
      <View style={styles.form}>
        <Text>Signup</Text>
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
          value={phoneNumber}
          error={phoneNumberError}
          required
          disabled={isLoading ? true : false}
        />

        <Picker
          selectedValue={vendorType}
          style={{
            height: 50,
            width: 150,
            backgroundColor: "white",
            color: "white",
          }}
          onValueChange={this.updateVendorType}
        >
          <Picker.Item label="Select Type" value="not-selected" />

          <Picker.Item label="Tiffin" value="tiffin" />
          <Picker.Item label="Grocery" value="grocery" />
          <Picker.Item label="Hawker" value="hawker" />
        </Picker>
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
    // marginVertical: 30,

    backgroundColor: "#dfe2ff",
    color: "rgb(255,255,255)",
    width: "30%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});
