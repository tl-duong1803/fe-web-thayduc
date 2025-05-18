import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

function UserList() {
  const users = models.userListModel();

  const renderUserItem = (user) => (
    <React.Fragment key={user._id}>
      <ListItem button component={Link} to={`/users/${user._id}`}>
        <ListItemText primary={user.first_name} />
      </ListItem>
      <Divider />
    </React.Fragment>
  );

  return (
    <div>
      <Typography variant="body1">
        This is the user list, which takes up 3/12 of the window. You might
        choose to use{" "}
        <a
          href="https://mui.com/components/lists/"
          target="_blank"
          rel="noreferrer"
        >
          Lists
        </a>{" "}
        and{" "}
        <a
          href="https://mui.com/components/dividers/"
          target="_blank"
          rel="noreferrer"
        >
          Dividers
        </a>{" "}
        to display your users like so:
      </Typography>

      <List component="nav">{users.map(renderUserItem)}</List>

      <Typography variant="body1">
        The model comes in from models.userListModel()
      </Typography>
    </div>
  );
}

export default UserList;
