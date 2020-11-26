import { AntDesign, Feather } from "@expo/vector-icons";
import React, { Component } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default class Input extends Component {
  onChangeText = (text) => {
    const { update } = this.props;
    update(text);
  };

  render() {
    const {
      type,
      placeholder,
      value,
      maxLength,
      required,
      error,
      disabled,
    } = this.props;
    return (
      <View style={[styles.input, error ? styles.error : {}]}>
        <View style={styles.icon}>
          {type === "email-address" ? (
            <AntDesign name="mail" size={24} color="black" />
          ) : type === "phone-pad" ? (
            <Feather name="smartphone" size={24} color="black" />
          ) : type === "visible-password" ? (
            <AntDesign name="lock1" size={24} color="black" />
          ) : (
            <Feather name="file-text" size={24} color="black" />
          )}
        </View>

        <View style={styles.textInput}>
          {required ? <Text style={styles.req}>*</Text> : ""}

          <TextInput
            editable={disabled ? false : true}
            style={styles.inputBox}
            placeholder={placeholder}
            keyboardType={
              type === "visible-password" || type === "default"
                ? "default"
                : type
            }
            secureTextEntry={type === "visible-password" ? true : false}
            value={value}
            onChangeText={this.onChangeText}
            maxLength={maxLength ? maxLength : 40}
            autoCapitalize={
              type === "email-address" ||
              type === "visible-password" ||
              type === "default"
                ? "none"
                : "words"
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    // borderColor: "yellow",
    backgroundColor: "white",
    opacity: 0.7,
    borderWidth: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 10,
    borderColor: "transparent",
    borderBottomColor: "transparent",
  },
  inputBox: {
    width: "100%",
    height: 50,
  },
  req: {
    color: "red",
  },
  textInput: {
    flex: 1,
    flexDirection: "row",
    // marginHorizontal: 1,
  },
  icon: {
    margin: 10,
  },
  error: {
    borderBottomColor: "red",
  },
});
