const express = require("express")
const Photo = require("../db/photoModel")
const User = require("../db/userModel")
const mongoose = require("mongoose")
const router = express.Router()

// GET /photosOfUser/:id - Return photos of a specific user with comments
router.get("/photosOfUser/:id", async (request, response) => {
  try {
    const userId = request.params.id

    // Check if the ID is valid
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return response.status(400).json({ message: "Invalid user ID format" })
    }

    // Check if user exists
    const userExists = await User.findById(userId)
    if (!userExists) {
      return response.status(400).json({ message: "User not found" })
    }

    // Find all photos for the user
    const photos = await Photo.find({ user_id: userId })

    // For each photo, populate the user information for each comment
    const photosWithCommentUsers = await Promise.all(
      photos.map(async (photo) => {
        const photoObj = photo.toObject()

        if (photoObj.comments && photoObj.comments.length > 0) {
          // Get all unique user IDs from comments
          const userIds = [...new Set(photoObj.comments.map((comment) => comment.user_id))]

          // Fetch all users in one query
          const users = await User.find({ _id: { $in: userIds } }, { _id: 1, first_name: 1, last_name: 1 })

          // Create a map of user IDs to user objects for quick lookup
          const userMap = {}
          users.forEach((user) => {
            userMap[user._id.toString()] = user
          })

          // Add user info to each comment
          photoObj.comments = photoObj.comments.map((comment) => {
            const userId = comment.user_id.toString()
            return {
              _id: comment._id,
              comment: comment.comment,
              date_time: comment.date_time,
              user: userMap[userId] || null,
            }
          })
        }

        return {
          _id: photoObj._id,
          user_id: photoObj.user_id,
          comments: photoObj.comments || [],
          file_name: photoObj.file_name,
          date_time: photoObj.date_time,
        }
      }),
    )

    response.status(200).json(photosWithCommentUsers)
  } catch (error) {
    console.error("Error fetching photos:", error)
    response.status(500).json({ message: "Error fetching photos", error: error.message })
  }
})

// POST /photo - Create a new photo
router.post("/", async (request, response) => {
  try {
    const { file_name, user_id } = request.body

    if (!file_name || !user_id) {
      return response.status(400).json({ message: "File name and user ID are required" })
    }

    // Check if user exists
    const userExists = await User.findById(user_id)
    if (!userExists) {
      return response.status(400).json({ message: "User not found" })
    }

    const newPhoto = new Photo({
      file_name,
      user_id,
      date_time: new Date(),
      comments: [],
    })

    const savedPhoto = await newPhoto.save()
    response.status(201).json(savedPhoto)
  } catch (error) {
    console.error("Error creating photo:", error)
    response.status(500).json({ message: "Error creating photo", error: error.message })
  }
})

// POST /photo/:photo_id/comment - Add a comment to a photo
router.post("/:photo_id/comment", async (request, response) => {
  try {
    const { photo_id } = request.params
    const { comment, user_id } = request.body

    if (!comment || !user_id) {
      return response.status(400).json({ message: "Comment text and user ID are required" })
    }

    // Check if photo exists
    const photo = await Photo.findById(photo_id)
    if (!photo) {
      return response.status(400).json({ message: "Photo not found" })
    }

    // Check if user exists
    const userExists = await User.findById(user_id)
    if (!userExists) {
      return response.status(400).json({ message: "User not found" })
    }

    // Add comment to photo
    photo.comments.push({
      comment,
      user_id,
      date_time: new Date(),
    })

    const updatedPhoto = await photo.save()
    response.status(201).json(updatedPhoto)
  } catch (error) {
    console.error("Error adding comment:", error)
    response.status(500).json({ message: "Error adding comment", error: error.message })
  }
})

module.exports = router
