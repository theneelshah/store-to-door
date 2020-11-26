import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { withNavigation } from "react-navigation";

class Header extends React.Component {
  openItems = () => {
    this.props.navigation.navigate("Items");
  };

  openDemo = () => {
    console.log("demo");
  };

  render() {
    const { title } = this.props;
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={this.openItems}>
          <View>
            <Text>Items</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerText}>{title || "Custom Header"}</Text>
        <TouchableOpacity onPress={this.openDemo}>
          <View>
            <Text>Demo</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(Header);

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 20,
  },
  img: {
    width: "100%",
    height: 200,
  },
  superScript: {
    position: "absolute",
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "rgba(95,197,123,0.8)",
    right: 15,
    bottom: 15,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  superScriptRight: {
    position: "absolute",
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "rgba(95,197,123,0.8)",
    right: -15,
    bottom: 15,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});
