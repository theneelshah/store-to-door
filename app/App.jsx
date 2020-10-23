import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import ServitorLoginPage from "./screens/Auth/ServitorLoginPage";
import UserLoginPage from "./screens/Auth/UserLoginPage";
import HomePage from "./screens/HomePage";

const App = createStackNavigator({
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

export default createAppContainer(App);
