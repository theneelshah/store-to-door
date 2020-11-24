import axios from "axios";
import React, { Component } from "react";
import {
  AsyncStorage,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { connect } from "react-redux";
import { placeActive } from "../actions/active";
import { addFood, deleteFood } from "../actions/food";

const Item = (props) => {
  const { item } = props;
  const { name, price } = item.detail;

  return (
    <View style={styles.item}>
      <Image
        style={styles.img}
        source={{
          uri: "https://reactnative.dev/img/tiny_logo.png",
        }}
      />
      <Text>{name}</Text>
      <Text>₹{price}</Text>
      {/* <TouchableOpacity style={styles.removeBtn}>
        <Text style={{ color: "white" }}>Remove Item from cart</Text>
      </TouchableOpacity> */}
    </View>
  );
};

class Orders extends Component {
  state = {
    activeOrders: [],
    completedOrders: [],
    price: 0,
  };

  async componentDidMount() {
    const { addActive, active } = this.props;
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://store-to-door13.herokuapp.com/user/order`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer: ${token}`,
          },
        }
      );
      // const { user } = response.data;
      const { activeOrders, completedOrders } = response.data;
      this.setState({ activeOrders, completedOrders }, () => {
        const { activeOrders } = this.state;
        const { active } = this.props;
        let price = 0;
        for (let i = 0; i < activeOrders.length; i += 1) {
          const { detail } = activeOrders[i];
          price += detail.price;
          let present = false;
          for (let j = 0; j < active.length; j += 1) {
            if (active[j].id == activeOrders[i]._id) {
              present = true;
            }
          }
          if (!present) addActive(activeOrders[i]);
        }

        this.setState({ price });
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { activeOrders, completedOrders, price } = this.state;
    const { active } = this.props;
    // console.log(active);
    // console.log(activeOrders);
    return (
      <View>
        {activeOrders.length >= 1 && (
          <View style={styles.section}>
            <Text>Active Orders</Text>
            <Text>Total price to pay: {price}</Text>
            <FlatList
              data={active}
              style={styles.list}
              renderItem={({ item }) => {
                return <Item item={item} key={item.id} />;
              }}
              keyExtractor={(item) => item._id}
            />
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    foods: state.foodReducer.foodList,
    active: state.activeReducer.activeList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    add: (food) => dispatch(addFood(food)),
    remove: (item) => dispatch(deleteFood(item)),

    addActive: (food) => dispatch(placeActive(food)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);

const styles = StyleSheet.create({
  section: {},
  img: {
    width: "100%",
    height: 200,
  },
  removeBtn: {
    backgroundColor: "#dfe2ff",
    padding: 10,
  },
});
