import Index from "views/Index.js";
import Profile from "views/pages/Profile.js";
import Login from "views/pages/Login.js";
import Tables from "views/pages/Tables.js";
import Blank from "views/pages/blank.js";
import Users from "views/pages/users.js";
import User from "views/pages/user.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Users",
    icon: "ni ni-bullet-list-67 text-blue",
    component: Users,
    layout: "/admin",
  },
  {
    path: "/user/:id",
    name: "User",
    icon: "ni ni-bullet-list-67 text-blue",
    component: User,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/blank",
    name: "Blank",
    icon: "ni ni-planet text-blue",
    component: Blank,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
    hidden: true,
  },
];
export default routes;
