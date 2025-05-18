"use client"
import { useState, useEffect } from "react"
import { Typography, Card, CardContent, CircularProgress, Box, Divider } from "@mui/material"
import { useParams, Link } from "react-router-dom"
import { userService, photoService } from "../../services/api"
import "./styles.css"

function UserPhotos() {
  const { userId } = useParams()
  const [userData, setUserData] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch user data and photos in parallel
        const [user, userPhotos] = await Promise.all([
          userService.getUserById(userId),
          photoService.getPhotosByUserId(userId),
        ])

        setUserData(user)
        setPhotos(userPhotos)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Failed to load photos. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchData()
    }
  }, [userId])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" padding={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" style={{ padding: "20px" }}>
        {error}
      </Typography>
    )
  }

  if (!userData) {
    return (
      <Typography variant="body1" color="error" style={{ padding: "20px" }}>
        User not found
      </Typography>
    )
  }

  if (!photos || photos.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Photos of{" "}
            <Link to={`/users/${userData._id}`} style={{ textDecoration: "none", color: "black" }}>
              {userData.first_name} {userData.last_name}
            </Link>
          </Typography>
          <Typography variant="body1">This user doesn't have any photos yet.</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Photos of{" "}
          <Link to={`/users/${userData._id}`} style={{ textDecoration: "none", color: "black" }}>
            {userData.first_name} {userData.last_name}
          </Link>
        </Typography>

        {photos.map((photo) => (
          <Box key={photo._id} mb={4}>
            <Box mb={2}>
              <img
                src={`http://localhost:8081/images/${photo.file_name}`}
                alt={`Photo by ${userData.first_name}`}
                style={{ maxWidth: "100%", height: "auto" }}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg?height=300&width=400"
                }}
              />
              <Typography variant="caption" display="block" mt={1}>
                Posted on: {new Date(photo.date_time).toLocaleString()}
              </Typography>
            </Box>

            <Divider />

            <Box mt={2}>
              <Typography variant="h6">Comments:</Typography>
              {photo.comments && photo.comments.length > 0 ? (
                photo.comments.map((comment) => (
                  <Card key={comment._id} variant="outlined" style={{ marginTop: "10px" }}>
                    <CardContent>
                      <Typography variant="subtitle1" component="div">
                        <Link to={`/users/${comment.user._id}`} style={{ textDecoration: "none", color: "black" }}>
                          {comment.user.first_name} {comment.user.last_name}
                        </Link>
                      </Typography>
                      <Typography variant="body1">{comment.comment}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Posted on: {new Date(comment.date_time).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" mt={1}>
                  No comments yet
                </Typography>
              )}
            </Box>

            <Divider style={{ marginTop: "20px" }} />
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}

export default UserPhotos
