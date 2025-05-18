import React from "react";
import { Typography, Card, CardContent } from "@mui/material";

import "./styles.css";
import { useParams, Link } from "react-router-dom";

import models from "../../modelData/models";

/**
 * Define UserPhotos, a React component of Project 4.
 */

function UserPhotos() {
  const user = useParams();
  const data = models.userModel(user.userId);
  const photos = models.photoOfUserModel(user.userId);
  console.log(photos);
  if (!data) {
    return <Typography variant="body1">User not found</Typography>;
  }
  if (!photos || photos.length === 0) {
    return (
      <Typography>
        {data.first_name} {data.last_name} donn't have a photo
      </Typography>
    );
  }
  return (
    <div>
      <Card>
        <CardContent>
          <Typography>
            Photo of{" "}
            <Link
              to={`/users/${data._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              {data.first_name} {data.last_name}
            </Link>
          </Typography>
          <Typography variant="body1">
            {photos.map((photo) => (
              <div key={photo._id}>
                <div>
                  <img src={`../../images/${photo.file_name}`} alt="" />
                  <p>Post at: {photo.date_time}</p>
                </div>
                <hr />
                <div>
                  {photo.comments && photo.comments.length > 0 ? (
                    <div>
                      <p>Comments:</p>
                      {photo.comments.map((item) => (
                        <Card>
                          <CardContent>
                            <Typography
                              variant="h5"
                              component="div"
                              gutterBottom
                            >
                              <Link
                                to={`/users/${item.user._id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                {item.user.first_name} {item.user.last_name}
                              </Link>
                            </Typography>
                            <Typography variant="body1">
                              Comment: {item.comment}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              Post at: {item.date_time}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div>No comment</div>
                  )}
                </div>
                <hr />
              </div>
            ))}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserPhotos;
