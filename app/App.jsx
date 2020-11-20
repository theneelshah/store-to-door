import React from "react";
import { Provider } from "react-redux";
import App from "./routes";
import configureStore from "./store";

const store = configureStore();

const ParentApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default ParentApp;
