const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = process.env.PORT || 5000;
const atlasUri = process.env.MONGO_URI;
const localUri = "mongodb://127.0.0.1:27017/future_fs_01";

mongoose.set("strictQuery", false);

const connectDatabase = async () => {
  try {
    const uri = atlasUri || localUri;
    await mongoose.connect(uri);
    console.log(`MongoDB connected to ${atlasUri ? "Atlas" : "local"} database`);
  } catch (error) {
    console.error("Primary MongoDB connection failed:", error.message || error);

    if (atlasUri && !process.env.SKIP_LOCAL_FALLBACK) {
      console.log("Attempting local MongoDB fallback...");
      try {
        await mongoose.connect(localUri);
        console.log("MongoDB connected to local database");
        return;
      } catch (fallbackError) {
        console.error("Local MongoDB fallback failed:", fallbackError.message || fallbackError);
      }
    }

    process.exit(1);
  }
};

connectDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});
