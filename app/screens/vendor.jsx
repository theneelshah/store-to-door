import React, { Component } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { connect } from "react-redux";
import { addFood } from "../actions/food";

const Item = (props) => {
  const { item, addToCart, disabled } = props;
  return (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>

      <Image
        style={styles.img}
        source={{
          uri: "https://reactnative.dev/img/tiny_logo.png",
        }}
      />

      <Text style={styles.itemText}>₹{item.price}</Text>

      <TouchableOpacity
        onPress={() => addToCart(item)}
        style={styles.cart}
        disabled={disabled}
      >
        <Text>{disabled ? "Already present in the Cart" : "Add To Cart"}</Text>
      </TouchableOpacity>
    </View>
  );
};

class Vendor extends Component {
  state = {
    vendor: {},
  };

  componentDidMount() {
    const vendor = this.props.navigation.state.params.vendor;
    this.setState({ vendor });
  }

  render() {
    const { vendor } = this.state;
    // const { items } = vendor;
    const { _id, items } = vendor;
    const { add, foods } = this.props;

    return (
      <SafeAreaView>
        <ScrollView>
          <Text style={styles.heading}>{vendor && vendor.username}</Text>

          {items && items.length !== 0 ? (
            <View>
              <FlatList
                data={items}
                renderItem={({ item }) => {
                  let disabled = false;
                  const res = foods.find((food) => {
                    return food.itemId === item._id;
                  });
                  if (res !== undefined) disabled = true;
                  return (
                    <Item item={item} addToCart={add} disabled={disabled} />
                  );
                }}
                keyExtractor={(item) => item._id}
              />
            </View>
          ) : (
            <Text>No Items Present</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log(state);
  return {
    foods: state.foodReducer.foodList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    add: (food) => dispatch(addFood(food)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Vendor);
// export default Vendor;

const styles = StyleSheet.create({
  heading: {
    textAlign: "center",
    fontSize: 25,
  },
  img: {
    width: "100%",
    height: 200,
  },
  item: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#dfe2ff",
  },
  itemText: {
    fontSize: 17,
  },
  cart: {
    padding: 10,
    backgroundColor: "#e3e3e3",
    color: "white",
    flex: 1,
  },
});
