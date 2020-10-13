import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.centerOval}>
        <Text style={styles.heading}>Store To Door</Text>

        <Text style={styles.login}>Login As:</Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.pButton}>
            <Text>
              <Text style={{ color: "#ac48ee" }}>Servitor</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pButton}>
            <Text>
              <Text style={{ color: "#ac48ee" }}>User</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#aeaeae",
    alignItems: "center",
    justifyContent: "center",
  },
  centerOval: {
    backgroundColor: "white",
    width: "100%",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  pButton: {
    backgroundColor: "#dfe2ff",
    color: "rgb(255,255,255)",
    width: "30%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  heading: {
    fontSize: 50,
  },
  login: {
    fontSize: 20,
    margin: 15,
  },
});
