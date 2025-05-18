"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, Typography, Button, CircularProgress } from "@mui/material"
import { useParams, Link } from "react-router-dom"
import { userService } from "../../services/api"
import "./styles.css"

function UserDetail() {
  const params = useParams()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const data = await userService.getUserById(params.userId)
        setUserData(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch user details:", err)
        setError("Failed to load user details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (params.userId) {
      fetchUserData()
    }
  }, [params.userId])

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
        <CircularProgress />
      </div>
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {`${userData.first_name || ""} ${userData.last_name || ""}`}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Location: {userData.location || "Not specified"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Occupation: {userData.occupation || "Not specified"}
        </Typography>
        <Typography variant="body2" style={{ marginTop: "10px", marginBottom: "20px" }}>
          Description: {userData.description || "No description available"}
        </Typography>
        <Button variant="contained" component={Link} to={`/photos/${userData._id}`}>
          View Photos
        </Button>
      </CardContent>
    </Card>
  )
}

export default UserDetail
