import axios from "axios";
import React, { Component } from "react";
import { AsyncStorage, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";

// const Item = (props) => {
//   const { item, remove } = props;

//   return (
//     <View style={styles.item}>
//       <Image
//         style={styles.img}
//         source={{
//           uri: "https://reactnative.dev/img/tiny_logo.png",
//         }}
//       />
//       <Text>{item.name.name}</Text>
//       <Text>₹{item.name.price}</Text>
//       <TouchableOpacity
//         onPress={() => {
//           remove(item.itemId);
//         }}
//         style={styles.removeBtn}
//       >
//         <Text style={{ color: "white" }}>Remove Item from cart</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

class Orders extends Component {
  state = {
    activeOrders: [],
    completedOrders: [],
  };

  async componentDidMount() {
    try {
      const id = await AsyncStorage.getItem("id");
      const token = await AsyncStorage.getItem("token");
      console.log(id);
      const response = await axios.get(
        `https://store-to-door13.herokuapp.com/user/order`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer: ${token}`,
          },
        }
      );
      const { user } = response.data;
      // const { activeOrders, completedOrders } = user;
      console.log(response.data);
      // this.setState({ activeOrders, completedOrders });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { activeOrders, completedOrders } = this.state;
    console.log(activeOrders);
    return (
      <View>
        {activeOrders.length >= 1 && (
          <View style={styles.section}>
            <Text>Active Orders</Text>
            {/* <FlatList
              data={activeOrders}
              style={styles.list}
              renderItem={({ item }) => {
                return <Item item={item} key={item._id} />;
              }}
              keyExtractor={(item) => item._id}
            /> */}
          </View>
        )}
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

export default connect(mapStateToProps)(Orders);

const styles = StyleSheet.create({
  section: {},
});
