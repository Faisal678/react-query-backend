const express = require('express')
const { registerUser, loginUser, userProfile } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/profile', protect, userProfile)

module.exports = router