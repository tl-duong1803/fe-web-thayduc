const express = require("express")
const User = require("../db/userModel")
const router = express.Router()

// GET /user/list - Return the list of users for the navigation sidebar
router.get("/list", async (request, response) => {
  try {
    const users = await User.find({}, { first_name: 1, last_name: 1 })
    response.status(200).json(users)
  } catch (error) {
    console.error("Error fetching user list:", error)
    response.status(500).json({ message: "Error fetching user list", error: error.message })
  }
})

// GET /user/:id - Return detailed information of a specific user
router.get("/:id", async (request, response) => {
  try {
    const userId = request.params.id

    // Check if the ID is valid
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(400).json({ message: "Invalid user ID format" })
    }

    const user = await User.findById(userId, {
      _id: 1,
      first_name: 1,
      last_name: 1,
      location: 1,
      description: 1,
      occupation: 1,
    })

    if (!user) {
      return response.status(400).json({ message: "User not found" })
    }

    response.status(200).json(user)
  } catch (error) {
    console.error("Error fetching user details:", error)
    response.status(500).json({ message: "Error fetching user details", error: error.message })
  }
})

// POST /user - Create a new user
router.post("/", async (request, response) => {
  try {
    const { first_name, last_name, location, description, occupation } = request.body

    if (!first_name || !last_name) {
      return response.status(400).json({ message: "First name and last name are required" })
    }

    const newUser = new User({
      first_name,
      last_name,
      location,
      description,
      occupation,
    })

    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
  } catch (error) {
    console.error("Error creating user:", error)
    response.status(500).json({ message: "Error creating user", error: error.message })
  }
})

module.exports = router
