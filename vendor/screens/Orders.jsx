import axios from "axios";
import React, { Component } from "react";
import {
  AsyncStorage,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

class ActiveOrder extends Component {
  state = {
    currentItem: {},
    user: { email: "", username: "", phone: null, _id: "", activeOrderId: "" },
  };

  componentDidMount() {
    const { active, items } = this.props;
    const itemId = active.item;
    const { status } = active;
    const currentItem = items.find((el) => el._id === itemId);
    this.setState({ currentItem });
    const { user } = active;
    this.setState({
      user: {
        email: user.email,
        username: user.username,
        activeOrderId: user.activeOrderId,
        phone: user.phone,
        _id: user._id,
      },
    });
  }

  onAccept = async () => {
    const { active } = this.props;
    const { user, item } = active;
    const vendorActiveId = active._id;
    const itemId = active.item;
    const userId = user._id;
    const { email, username } = user;
    const userActiveId = user.activeOrderId;

    const acceptOrder = {
      vendorActiveId,
      itemId,
      user: {
        _id: userId,
        email,
        username,
        userActiveId,
      },
    };

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `https://store-to-door13.herokuapp.com/vendor/orders`,
        {
          itemId: acceptOrder.itemId,
          user: acceptOrder.user,
          vendorActiveId: acceptOrder.vendorActiveId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer: ${token}`,
          },
        }
      );
      const { data, status } = response;
      const { vendor, user } = data;
      const { activeOrders } = vendor;
      const { changeActive } = this.props;

      changeActive(acceptOrder.vendorActiveId);
    } catch (error) {
      console.log(error.message);
      console.log(error.response);
    }
  };

  onReject = () => {
    const { active, changeReject } = this.props;
    const { user, item } = active;
    const vendorActiveId = active._id;
    const itemId = active.item;
    const userId = user._id;
    const { email, username } = user;
    const userActiveId = user.activeOrderId;

    changeReject(vendorActiveId);
  };

  render() {
    const { active } = this.props;
    const { currentItem } = this.state;
    const { images, name, price } = currentItem;
    const { quantity, status } = active;
    return (
      <View style={styles.singleItem} key={active.item}>
        {status === "Accepted" && (
          <View style={styles.acceptedWrapper}>
            <Text>Accepted Order, Preparing</Text>
          </View>
        )}
        <Image
          style={styles.img}
          source={{
            uri: "https://reactnative.dev/img/tiny_logo.png",
          }}
        />
        <Text>Item Name: {name}</Text>
        <Text>Individual Price: {price}</Text>
        <Text>Total Price: {quantity * price}</Text>
        <Text>Client Name: {active.user.username}</Text>
        <Text>Quantity: {quantity}</Text>

        {status === "Placed" && (
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.accept}
              onPress={() => {
                console.log("Accept");
              }}
            >
              <Text>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reject} onPress={this.onReject}>
              <Text>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

class Rejected extends Component {
  state = {
    currentItem: {},
    user: { email: "", username: "", phone: null, _id: "" },
  };

  componentDidMount() {
    const { item } = this.props.item;
    const { items } = this.props;
    const currentItem = items.find((el) => el._id === item.item);
    const { user } = item;
    this.setState({
      currentItem,
      user: {
        email: user.email,
        username: user.username,
        phone: user.phone,
        _id: user._id,
      },
    });
  }

  render() {
    const { item } = this.props.item;
    const { items } = this.props;
    const { currentItem, user } = this.state;
    const { name, price, images } = currentItem;
    const { email, username, phone } = user;
    return (
      <View style={styles.singleItem}>
        <View style={styles.rejectedWrapper}>
          <Text style={styles.accepted}>Order Rejected</Text>
        </View>
        <View>
          <Image
            style={styles.img}
            source={{
              uri: "https://reactnative.dev/img/tiny_logo.png",
            }}
          />
          <Text>Item Name: {name}</Text>
          <Text>Client Name: {username}</Text>
        </View>
      </View>
    );
  }
}

export default class Orders extends Component {
  state = {
    username: "",
    email: "",
    vendorType: "",
    items: [],
    activeOrders: [],
    completedOrders: [],
  };

  async componentDidMount() {
    try {
      const id = await AsyncStorage.getItem("id");
      const response = await axios.get(
        `https://store-to-door13.herokuapp.com/vendor/${id}`
      );
      const { data, status } = response;
      const {
        activeOrders,
        completedOrders,
        email,
        items,
        username,
        vendorType,
      } = data.vendor;

      this.setState({
        email,
        username,
        completedOrders,
        items,
        activeOrders,
        vendorType,
      });
    } catch (error) {
      const { data, status } = error.response;
      console.log(data);
    }
  }

  changeActive = (vendorActiveId) => {
    let { activeOrders } = this.state;

    console.log(vendorActiveId);
    console.log(activeOrders);
    for (let i = 0; i < activeOrders.length; i += 1) {
      if (`${vendorActiveId}` === `${activeOrders[i]._id}`) {
        console.log("true");
        activeOrders[i].status = "Accepted";
      }
    }
    this.setState({ activeOrders });
  };

  changeReject = (vendorRejectId) => {
    let { activeOrders, completedOrders } = this.state;

    for (let i = 0; i < activeOrders.length; i += 1) {
      if (`${activeOrders[i]._id}` === `${vendorRejectId}`) {
        const res = activeOrders.splice(i, 1);
        completedOrders.push(res[0]);
      }
    }
    this.setState({ activeOrders, completedOrders });
  };

  render() {
    const {
      activeOrders,
      completedOrders,
      email,
      items,
      username,
      vendorType,
    } = this.state;
    console.log(completedOrders);
    return (
      <SafeAreaView>
        <ScrollView>
          <Text style={styles.heading}>Welcome back {username}</Text>

          {activeOrders.length > 0 && (
            <View>
              <Text>Active Orders:</Text>
              <FlatList
                data={activeOrders}
                renderItem={(item) => (
                  <ActiveOrder
                    active={item.item}
                    items={items}
                    changeActive={this.changeActive}
                    changeReject={this.changeReject}
                  />
                )}
                keyExtractor={(item) => item.item.item}
              />
            </View>
          )}

          {completedOrders.length > 0 && (
            <View>
              <Text>Completed Orders:</Text>
              <FlatList
                data={completedOrders}
                renderItem={(item) => <Rejected item={item} items={items} />}
                keyExtractor={(item) => item._id}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 25,
    textAlign: "center",
  },
  singleItem: {
    backgroundColor: "#dfe2ff",
    padding: 10,
    marginVertical: 10,
  },
  img: {
    width: "100%",
    height: 200,
  },
  accept: {
    backgroundColor: "green",
    padding: 10,
    width: "40%",
  },
  reject: {
    backgroundColor: "red",
    padding: 10,
    width: "40%",
  },

  button: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  acceptedWrapper: {
    width: "50%",
    backgroundColor: "green",
    padding: 10,
  },
  rejectedWrapper: {
    width: "50%",
    backgroundColor: "red",
    padding: 10,
  },
});
