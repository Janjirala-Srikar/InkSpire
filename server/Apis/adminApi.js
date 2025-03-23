const exp = require('express');
const adminApp = exp.Router();
const UserAuthor = require("../Models/userAuthorModel");

// Check if user is admin
adminApp.get('/check-admin', async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).send({ message: "Email parameter is required" });
        }
        
        const user = await UserAuthor.findOne({ email: email });
        
        if (!user) {
            return res.status(404).send({ message: "User not found", isAdmin: false });
        }
        
        res.status(200).send({
            message: "Admin status checked",
            isAdmin: user.role === 'admin',
            userId: user._id, // Include user ID for future requests
            role: user.role // Include the actual role value
        });
    } catch (error) {
        console.error("Admin check error:", error);
        res.status(500).send({ message: "Error checking admin status", error: error.message });
    }
});

// Get all users and authors
adminApp.get('/userauthors', async (req, res) => {
    try {
        const users = await UserAuthor.find()
        res.status(200).send({ message: "Users fetched successfully", payload: users });
    } catch (error) {
        res.status(500).send({ message: "Error fetching users", error: error.message });
    }
});


// Update user status (block/unblock) using email
adminApp.put('/userauthors/:email/status', async (req, res) => {
    try {
        const { isActive } = req.body;
        const { email } = req.params;
       
        if (typeof isActive !== 'boolean') {
            return res.status(400).send({ message: "isActive must be a boolean value" });
        }
       
        // Find and update user isActive by email instead of ID
        const updatedUser = await UserAuthor.findOneAndUpdate(
            { email: email },
            { isActive: isActive },
            { new: true }
        );
       
        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }
       
        res.status(200).send({
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            payload: updatedUser
        });
    } catch (error) {
        res.status(500).send({ message: "Error updating user status", error: error.message });
    }
});




module.exports = adminApp;