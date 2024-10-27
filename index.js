const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fghxosh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("Portfolio");
    const projects = db.collection("projects");
    const skills = db.collection("skills");
    const blogs = db.collection("blogs");

    // Routes

    // Login Route
    app.post("/login", (req, res) => {
      const { password } = req.body;
      const result = password === process.env.USER_PASS;
      res.send({ success: result });
    });

    // Add Skill Route
    app.post("/skills", async (req, res) => {
      const data = req.body;
      try {
        const result = await skills.insertOne(data);
        res.send(result);
      } catch (error) {
        console.error("Error inserting skill:", error);
        res.status(500).send({ error: "Failed to insert skill" });
      }
    });

    // Get Skills Route
    app.get("/skills", async (req, res) => {
      try {
        const result = await skills.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching skills:", error);
        res.status(500).send({ error: "Failed to fetch skills" });
      }
    });

    //Add Project Route
    app.post("/projects", async (req, res) => {
      const data = req.body;
      try {
        const result = await projects.insertOne(data);
        res.send(result);
      } catch (error) {
        console.error("Error inserting project:", error);
        res.status(500).send({ error: "Failed to insert project" });
      }
    });

    // Get Projects Route
    app.get("/projects", async (req, res) => {
      try {
        const result = await projects.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).send({ error: "Failed to fetch projects" });
      }
    });

    //Single Project Route
    app.get("/projects/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const { ObjectId } = require("mongodb");
        const result = await projects.findOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).send({ error: "Failed to fetch project" });
      }
    });

    // Add Blog Route
    app.post("/blogs", async (req, res) => {
      const data = req.body;
      try {
        const result = await blogs.insertOne(data);
        res.send(result);
      } catch (error) {
        console.error("Error inserting blog:", error);
        res.status(500).send({ error: "Failed to insert blog" });
      }
    });

    // Get Blogs Route
    app.get("/blogs", async (req, res) => {
      try {
        const result = await blogs.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).send({ error: "Failed to fetch blogs" });
      }
    });

    //Single Blog Route
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const { ObjectId } = require("mongodb");
        const result = await blogs.findOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).send({ error: "Failed to fetch blog" });
      }
    });

    // Root Route
    app.get("/", (req, res) => {
      res.send("Server is running");
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
  }
}

run().catch(console.dir);
