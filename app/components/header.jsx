import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import Icon from "react-native-vector-icons";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";

class Header extends React.Component {
  openOrders = () => {
    this.props.navigation.navigate("orders");
  };

  openCart = () => {
    this.props.navigation.navigate("cart");
  };

  render() {
    const { title, foods, active } = this.props;
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={this.openOrders}>
          <View>
            <View style={styles.superScriptRight}>
              <Text>{active.length}</Text>
            </View>

            <Text>Orders</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerText}>{title || "Custom Header"}</Text>
        <TouchableOpacity onPress={this.openCart}>
          <View>
            <View style={styles.superScript}>
              <Text>{foods.length}</Text>
            </View>

            <Text>Cart</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log(state);
  return {
    foods: state.foodReducer.foodList,
    active: state.activeReducer.activeList,
  };
};

export default connect(mapStateToProps)(withNavigation(Header));

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
