import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Header from "./components/header";
import ServitorLoginPage from "./screens/Auth/ServitorLoginPage";
import UserLoginPage from "./screens/Auth/UserLoginPage";
import Cart from "./screens/Cart";
import HomePage from "./screens/HomePage";
import Secured from "./screens/secured";
import Vendor from "./screens/vendor";

const Auth = createStackNavigator({
  Home: {
    screen: HomePage,
  },
  UserLogin: {
    screen: UserLoginPage,
  },

  ServitorLogin: {
    screen: ServitorLoginPage,
  },
});

const App = createStackNavigator({
  secured: {
    screen: Secured,
    navigationOptions: {
      headerTitle: () => <Header title="Secured" />,
    },
  },
  cart: {
    screen: Cart,
    navigationOptions: {
      headerTitle: () => <Header title="Cart" />,
    },
  },
  vendor: {
    screen: Vendor,
    navigationOptions: {
      headerTitle: () => <Header title="Secured" />,
    },
  },
});

export default createAppContainer(
  createSwitchNavigator({ Auth: Auth, App: App })
);
