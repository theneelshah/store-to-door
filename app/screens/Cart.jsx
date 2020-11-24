import axios from "axios";
import React from "react";
import {
  AsyncStorage,
  FlatList,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import { placeActive } from "../actions/active";
import { addFood, deleteFood } from "../actions/food";

const Item = (props) => {
  const { item, remove } = props;

  return (
    <View style={styles.item}>
      <Image
        style={styles.img}
        source={{
          uri: "https://reactnative.dev/img/tiny_logo.png",
        }}
      />
      <Text>{item.name.name}</Text>
      <Text>₹{item.name.price}</Text>
      <TouchableOpacity
        onPress={() => {
          remove(item.itemId);
        }}
        style={styles.removeBtn}
      >
        <Text style={{ color: "white" }}>Remove Item from cart</Text>
      </TouchableOpacity>
    </View>
  );
};

class Cart extends React.Component {
  state = {
    price: 0,
  };

  componentDidMount() {
    const { foods } = this.props;
    let price = 0;
    for (let i = 0; i < foods.length; i += 1) {
      const el = foods[i];
      price += el.name.price;
    }
    this.setState({ price });
  }

  onOrder = async () => {
    ToastAndroid.show("Ordering...", ToastAndroid.SHORT);
    const { foods, remove, addActive } = this.props;
    // console.log(foods);
    let ids = [];
    for (let i = 0; i < foods.length; i += 1) {
      const { itemId } = foods[i];
      ids.push(itemId);
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "https://store-to-door13.herokuapp.com/user/order",
        { item: ids },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer: ${token}`,
          },
        }
      );
      const { activeOrders } = response.data.user;
      ToastAndroid.show(`${foods.length} items ordered`, ToastAndroid.LONG);

      for (let i = 0; i < foods.length; i += 1) {
        const { itemId } = foods[i];
        remove(itemId);
      }
      for (let i = 0; i < activeOrders.length; i += 1) {
        addActive(activeOrders[i]);
      }
      this.props.navigation.navigate("orders");
    } catch (error) {
      // console.log(error.response.data);
      // console.log(error.response);
    }
  };

  render() {
    const { foods, remove } = this.props;
    const { price } = this.state;

    return (
      <View>
        <Text>Cart</Text>
        {foods.length > 0 ? (
          <View style={styles.view}>
            <FlatList
              data={foods}
              style={styles.list}
              renderItem={({ item }) => {
                return <Item item={item} remove={remove} key={item._id} />;
              }}
              keyExtractor={(item) => item._id}
            />

            <View style={styles.final}>
              <Text>Total Price: {price}</Text>

              <TouchableOpacity style={styles.login} onPress={this.onOrder}>
                <Text>Place Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text>No Items Present</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

const styles = StyleSheet.create({
  img: {
    width: "100%",
    height: 200,
  },
  item: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#dfe2ff",
  },
  removeBtn: {
    backgroundColor: "red",
    padding: 10,
  },
  list: {
    margin: 10,
  },
  view: {},
  login: {
    backgroundColor: "#dfe2ff",
    color: "rgb(255,255,255)",
    width: "30%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  final: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
