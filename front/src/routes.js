import Index from "views/Index.js";
import Profile from "views/pages/Profile.js";
import Login from "views/pages/Login.js";
import Tables from "views/pages/Tables.js";
import Blank from "views/pages/blank.js";
import Users from "views/pages/users";
import User from "views/pages/users/find.js";
import Verify from "views/pages/document";
import Document from "views/pages/document/find";

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
    path: "/verify",
    name: "Document verification",
    icon: "ni ni-bullet-list-67 text-blue",
    component: Verify,
    layout: "/admin",
  },
  {
    path: "/document/:id",
    name: "Document",
    icon: "ni ni-bullet-list-67 text-blue",
    component: Document,
    layout: "/admin",
    hidden: true,
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
