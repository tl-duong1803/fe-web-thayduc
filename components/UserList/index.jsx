"use client"

import React, { useState, useEffect } from "react"
import { Divider, List, ListItem, ListItemText, Typography, CircularProgress } from "@mui/material"
import { Link } from "react-router-dom"
import { userService } from "../../services/api"
import "./styles.css"

function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await userService.getUsers()
        setUsers(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch users:", err)
        setError("Failed to load users. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const renderUserItem = (user) => (
    <React.Fragment key={user._id}>
      <ListItem button component={Link} to={`/users/${user._id}`}>
        <ListItemText primary={`${user.first_name || ""} ${user.last_name || ""}`} />
      </ListItem>
      <Divider />
    </React.Fragment>
  )

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

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom style={{ padding: "10px" }}>
        Users
      </Typography>

      {users.length > 0 ? (
        <List component="nav">{users.map(renderUserItem)}</List>
      ) : (
        <Typography variant="body1" style={{ padding: "10px" }}>
          No users found.
        </Typography>
      )}
    </div>
  )
}

export default UserList
