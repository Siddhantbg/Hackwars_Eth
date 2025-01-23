const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require('./routes/userRoute.js');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// app.use(express.json());
app.use("/api/user", userRouter);

// MongoDB Connection
mongoose
  .connect("mongodb://sahilthegreat760:sahil12345@ac-sdo1nfn-shard-00-00.l3vntdx.mongodb.net:27017,ac-sdo1nfn-shard-00-01.l3vntdx.mongodb.net:27017,ac-sdo1nfn-shard-00-02.l3vntdx.mongodb.net:27017/?ssl=true&replicaSet=atlas-11cq0d-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Define Schema and Model
const tagSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  tag: { type: String, required: true },
});

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
// }, { minimize: false })

// const userModel = mongoose.models.user || mongoose.model("user", userSchema);

// module.exports = userModel;

const Tag = mongoose.model("Tag", tagSchema);

// API Routes

// Fetch tag for an address
app.get("/api/tag/:address", async (req, res) => {
  const { address } = req.params;
  try {
    const taggedAddress = await Tag.findOne({ address });
    if (taggedAddress) {
      res.json(taggedAddress);
    } else {
      res.json(null);
    }
  } catch (err) {
    res.status(500).send("Error fetching tag");
  }
});

// Save or update tag for an address
app.post("/api/tag", async (req, res) => {
  const { address, tag } = req.body;

  try {
    let taggedAddress = await Tag.findOne({ address });
    if (taggedAddress) {
      taggedAddress.tag = tag;
      await taggedAddress.save();
    } else {
      taggedAddress = new Tag({ address, tag });
      await taggedAddress.save();
    }
    res.status(200).json(taggedAddress);
  } catch (err) {
    res.status(500).send("Error saving tag");
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

