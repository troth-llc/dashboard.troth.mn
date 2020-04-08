import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import "assets/scss/style.scss";
import "assets/scss/auth.scss";
import axios from "axios";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("dashboard");
  if (token !== null) {
    config.headers["x-auth-token"] = token;
    config.headers.Authorization = `Bearer ${localStorage.dashboard}`;
  }
  return config;
});
const PrivateRoute = ({ render: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.dashboard ? (
        <Component {...props} />
      ) : (
        <Redirect to="/auth" />
      )
    }
  />
);
ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <PrivateRoute
        path="/admin"
        render={(props) => <AdminLayout {...props} />}
      />
      <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
      <Redirect from="/" to="/admin/index" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
