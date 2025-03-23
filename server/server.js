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

app.use(cors());

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
app.get('/',()=>{
   res.send("Welocme to InkSpire")
})

// Connect API routes
app.use("/user-api", userApp);
app.use("/author-api", authorApp);
app.use("/admin-api", adminApp);

// handler
app.use((err, req, res, next) => {
  console.error("Error handled by Express async handler:", err);
  res.status(500).json({ message: err.message });
});