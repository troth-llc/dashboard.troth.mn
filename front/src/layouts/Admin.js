import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
// user context
import { User } from "context/user";
import axios from "axios";

class Admin extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = { user: null };
  }
  componentDidMount() {
    axios
      .get("/api/auth")
      .then((response) => {
        const { user } = response.data;
        if (user === null) {
          localStorage.removeItem("dashboard");
          document.location.reload();
        }
        this.setState({ user });
      })
      .catch((error) => {
        if (error) {
          document.location.reload();
          localStorage.removeItem("dashboard");
        }
      });
  }
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }

  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Troth";
  };
  render() {
    return (
      <User.Provider value={this.state.user}>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("assets/img/brand/logo.png"),
            imgAlt: "...",
          }}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>
            {this.getRoutes(routes)}
            <Redirect from="*" to="/admin/index" />
          </Switch>
        </div>
      </User.Provider>
    );
  }
}

export default Admin;
