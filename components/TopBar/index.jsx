"use client"

import { useState, useEffect } from "react"
import { AppBar, Toolbar, Typography } from "@mui/material"
import { useLocation, Link } from "react-router-dom"
import { userService } from "../../services/api"
import "./styles.css"

function TopBar() {
  const userName = "Thang Le Duong"
  const { pathname } = useLocation()
  const [contextTitle, setContextTitle] = useState("Home")

  useEffect(() => {
    const updateContext = async () => {
      if (pathname === "/") {
        setContextTitle("Home")
      } else if (pathname === "/users") {
        setContextTitle("List of users")
      } else if (pathname.startsWith("/users/")) {
        const userId = pathname.substring(pathname.lastIndexOf("/") + 1)
        try {
          const userData = await userService.getUserById(userId)
          if (userData) {
            setContextTitle(`Details of ${userData.first_name} ${userData.last_name}`)
          } else {
            setContextTitle("User not found")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setContextTitle("Error loading user")
        }
      } else if (pathname.startsWith("/photos/")) {
        const userId = pathname.substring(pathname.lastIndexOf("/") + 1)
        try {
          const userData = await userService.getUserById(userId)
          if (userData) {
            setContextTitle(`Photos of ${userData.first_name} ${userData.last_name}`)
          } else {
            setContextTitle("User not found")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setContextTitle("Error loading user")
        }
      } else {
        setContextTitle("Not found")
      }
    }

    updateContext()
  }, [pathname])

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
          {contextTitle}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
