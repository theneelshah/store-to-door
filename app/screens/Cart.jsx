import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import { addFood, deleteFood } from "../actions/food";

const Item = (props) => {
  const { item, remove } = props;
  console.log(item);
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
  render() {
    const { foods, remove } = this.props;
    console.log(this.props);
    return (
      <View>
        <Text>Cart</Text>
        {foods.length > 0 ? (
          <View>
            <FlatList
              data={foods}
              renderItem={({ item }) => {
                // console.log(item);
                return <Item item={item} remove={remove} />;
              }}
              keyExtractor={(item) => item._id}
            />
          </View>
        ) : (
          <Text>No Items Present</Text>
        )}
      </View>
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
    remove: (item) => dispatch(deleteFood(item)),
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
});
