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
  console.log(item);
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
    </View>
  );
};

class Orders extends Component {
  state = {
    activeOrders: [],
    completedOrders: [],
    rejected: 0,
    price: 0,
  };

  async componentDidMount() {
    const { addActive, active } = this.props;
    const token = await AsyncStorage.getItem("token");
    try {
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
      // console.log(response.data);
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
        // console.log(completedOrders.length);
        let rejected = 0;
        for (let i = 0; i < completedOrders.length; i += 1) {
          if (completedOrders[i].status === "rejected") {
            rejected += 1;
          }
        }
        this.setState({ price, rejected });
      });
    } catch (error) {
      console.log(error.response.data);
    }
  }

  render() {
    const { activeOrders, completedOrders, price, rejected } = this.state;
    const { active } = this.props;
    // console.log(active);
    // console.log(completedOrders);
    // console.log(rejected);
    return (
      <View>
        {activeOrders.length >= 1 && (
          <View style={styles.section}>
            <Text>Active Orders</Text>
            <Text>Total price to pay: {price}</Text>
            <FlatList
              data={activeOrders}
              style={styles.list}
              renderItem={({ item }) => {
                return <Item item={item} key={item.id} />;
              }}
              keyExtractor={(item) => item._id}
            />
          </View>
        )}
        {completedOrders.length >= 1 && (
          <View>
            <Text>Completed {completedOrders.length} orders</Text>
            {rejected > 0 && <Text>Rejected: {rejected}</Text>}
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
  item: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#dfe2ff",
  },
});
