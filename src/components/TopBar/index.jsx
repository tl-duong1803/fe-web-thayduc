import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useLocation, Link } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

function TopBar() {
  const userName = "Thang Le Duong";
  const { pathname } = useLocation();
  const user = pathname.substring(pathname.lastIndexOf("/") + 1);
  const data = models.userModel(user);

  const getContext = () => {
    if (pathname === "/") return "Home";
    if (pathname === "/users") return "List of users";
    if (pathname.startsWith("/users/") && data)
      return `Details of ${data.first_name} ${data.last_name}`;
    if (pathname.startsWith("/photos/") && data)
      return `Photos of ${data.first_name} ${data.last_name}`;
    return "error";
  };

  const currentContext = getContext();
  console.log("Pathname: >>>", pathname);
  console.log("current context: >>>", currentContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            {userName}
          </Link>{" "}
          |{" "}
          <Link to="/users" style={{ textDecoration: "none", color: "black" }}>
            Users
          </Link>
        </Typography>
        <Typography variant="h6" component="div">
          {currentContext}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
