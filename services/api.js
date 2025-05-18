// Base URL for API requests
const API_BASE_URL = "http://localhost:8081/api"

/**
 * Fetch wrapper with error handling
 */
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

/**
 * User related API calls
 */
export const userService = {
  // Get list of all users
  getUsers: () => {
    return fetchData(`${API_BASE_URL}/user/list`)
  },

  // Get details of a specific user
  getUserById: (userId) => {
    return fetchData(`${API_BASE_URL}/user/${userId}`)
  },
}

/**
 * Photo related API calls
 */
export const photoService = {
  // Get photos of a specific user
  getPhotosByUserId: (userId) => {
    return fetchData(`${API_BASE_URL}/photosOfUser/${userId}`)
  },

  // Add a new photo
  addPhoto: (photoData) => {
    return fetchData(`${API_BASE_URL}/photo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(photoData),
    })
  },

  // Add a comment to a photo
  addComment: (photoId, commentData) => {
    return fetchData(`${API_BASE_URL}/photo/${photoId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    })
  },
}
