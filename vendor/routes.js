import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Login from "./screens/Auth/Login";
import Signup from "./screens/Auth/Signup";
import HomePage from "./screens/HomePage";
import Items from "./screens/Items";
import Orders from "./screens/Orders";

const Auth = createStackNavigator({
  Home: {
    screen: HomePage,
  },
  Signup: {
    screen: Signup,
  },

  Login: {
    screen: Login,
  },
});

const App = createStackNavigator({
  Orders: {
    screen: Orders,
  },
  Items: {
    screen: Items,
  },
});

export default createAppContainer(
  createSwitchNavigator({ Auth: Auth, App: App })
);
