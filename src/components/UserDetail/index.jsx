import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

function UserDetail() {
  const params = useParams();
  const userData = models.userModel(params.userId);

  if (!userData) {
    return (
      <Typography variant="body1" color="error">
        User not found
      </Typography>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {`${userData.first_name} ${userData.last_name}`}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Location: {userData.location}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Occupation: {userData.occupation}
        </Typography>
        <Typography variant="body2">
          Description: {userData.description}
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to={`/photos/${userData._id}`}
        >
          View Photos
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;
