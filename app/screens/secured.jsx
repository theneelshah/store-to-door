import axios from "axios";
import React, { Component } from "react";
import {
  AsyncStorage,
  FlatList,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { logoutUser } from "../util/auth";

export default class Secured extends Component {
  state = {
    id: "",
    username: "",
    email: "",
    activeOrders: [],
    completedOrders: [],
    lat: null,
    lng: null,
    vendor: {
      totalVendors: null,
      vendors: [],
      tiffin: [],
      grocery: [],
      hawker: [],
    },
  };

  async componentDidMount() {
    const type = await AsyncStorage.getItem("type");
    const id = await AsyncStorage.getItem("id");

    // console.log(id);
    if (type !== "customer" || !type) {
      this.props.navigation.navigate("Home");
    }

    const response = await axios.get(
      `https://store-to-door13.herokuapp.com/user/${id}`
    );

    const data = response.data;
    const { _id, username, email, activeOrders, completedOrders } = data.user;
    // console.log(data);
    this.setState({ id: _id, username, email, activeOrders, completedOrders });
    const options = {
      enableHighAccuracy: true,
      timeOut: 20000,
      maximumAge: 60 * 60 * 24,
    };

    navigator.geolocation.getCurrentPosition(
      this.geoSuccess,
      this.geoFailure,
      options
    );
  }

  geoSuccess = (pos) => {
    const { coords } = pos;
    const { latitude, longitude } = coords;
    this.setState({ lat: latitude, lng: longitude }, async () => {
      try {
        const response = await axios.get(
          "https://store-to-door13.herokuapp.com/vendor",
          { params: { lat: this.state.lat, lng: this.state.lng } }
        );
        const { totalVendors, vendors } = response.data;
        let tiffin = [],
          grocery = [],
          hawker = [];

        vendors.map((el) => {
          const { vendorType } = el;
          if (vendorType === "tiffin") tiffin.push(el);
          else if (vendorType === "hawker") hawker.push(el);
          else grocery.push(el);
        });

        this.setState({
          vendor: { totalVendors, vendors, tiffin, grocery, hawker },
        });
      } catch (err) {
        console.log(err);
      }
    });
  };

  geoFailure = (err) => {
    console.log(err.message);
  };

  logout = async () => {
    logoutUser();
    this.props.navigation.navigate("Auth");
    ToastAndroid.show("Logged Out", ToastAndroid.LONG);
  };

  openVendor = (vendor) => {
    // console.log(vendor);
    this.props.navigation.navigate("vendor", { vendor });
  };

  render() {
    const {
      id,
      username,
      email,
      activeOrders,
      completedOrders,
      lat,
      lng,
      vendor,
    } = this.state;

    const { tiffin, hawker, grocery, totalVendors, vendors } = vendor;

    return (
      <SafeAreaView>
        <ScrollView>
          <Text style={styles.heading}>Welcome back {username}!</Text>

          {!lat || !lng ? (
            <Text>Finding Services near You</Text>
          ) : (
            <Text>Total Services Found: {totalVendors}</Text>
          )}

          {grocery.length === 0 ? (
            <></>
          ) : (
            <View>
              <Text style={styles.subHeading}>Grocery Services</Text>
              <FlatList
                data={grocery}
                renderItem={({ item }) => {
                  console.log(item);
                  return (
                    <View>
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                          this.openVendor(item);
                        }}
                      >
                        <Image
                          style={styles.img}
                          source={{
                            uri: "https://reactnative.dev/img/tiny_logo.png",
                          }}
                        />
                        <Text style={styles.itemText}>{item.username}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
                keyExtractor={(item) => item._id}
              />
            </View>
          )}

          {hawker.length === 0 ? (
            <></>
          ) : (
            <View>
              <Text style={styles.subHeading}>Hawkers Services</Text>
              <FlatList
                data={hawker}
                renderItem={({ item }) => (
                  <View>
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => {
                        this.openVendor(item);
                      }}
                    >
                      <Image
                        style={styles.img}
                        source={{
                          uri: "https://reactnative.dev/img/tiny_logo.png",
                        }}
                      />
                      <Text style={styles.itemText}>{item.username}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item._id}
              />
            </View>
          )}

          {tiffin.length === 0 ? (
            <></>
          ) : (
            <View>
              <Text style={styles.subHeading}>Tiffin Services</Text>
              <FlatList
                data={tiffin}
                renderItem={({ item }) => (
                  <View>
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => {
                        this.openVendor(item);
                      }}
                    >
                      <Image
                        style={styles.img}
                        source={{
                          uri: "https://reactnative.dev/img/tiny_logo.png",
                        }}
                      />
                      <Text style={styles.itemText}>{item.username}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item._id}
              />
            </View>
          )}

          <TouchableOpacity onPress={this.logout}>
            <Text>Logout</Text>
          </TouchableOpacity>
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
  subHeading: {
    fontSize: 20,
  },
  item: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#dfe2ff",
  },
  itemText: {
    fontSize: 17,
  },
  img: {
    width: "100%",
    height: 200,
  },
});
