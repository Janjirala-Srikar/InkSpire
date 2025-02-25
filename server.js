const exp = require("express");
const app = exp();
require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const cors = require("cors");

const userApp = require("./Apis/userApi");
const authorApp = require("./Apis/authorApi");
const adminApp = require("./Apis/adminApi");

const port = process.env.PORT || 4000;

// CORS configuration

app.use(cors({
  origin: "https://inkspire-blog.netlify.app", // Allow only this frontend
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// Database connection
mongoose
  .connect(process.env.URL)
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}...`));
    console.log("DB connection successful");
  })
  .catch((err) => console.log("Error in DB connection", err));

// Middleware
app.use(exp.json());


// Connect API routes
app.use("/user-api", userApp);
app.use("/author-api", authorApp);
app.use("/admin-api", adminApp);

app.get('/',async(req,res)=>{
  res.send({message:"Successfull Connection"})
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error handled by Express async handler:", err);
  res.status(500).json({ message: err.message });
});
