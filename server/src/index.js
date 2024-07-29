const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const resolvers = require("./resolvers");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
const { bucket } = require("./utils/utils");
const storage = multer.memoryStorage();
const upload = multer({ storage });

require("dotenv").config();

(async () => {
  const app = express();
  app.use(cors());

  const userContext = ({ req }) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1] || "";
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return { user };
      } catch (err) {
        console.log(err);
      }
    }
    return {};
  };

  const typeDefs = fs.readFileSync(
    path.join(__dirname, "schema.graphql"),
    "utf-8"
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: userContext,
    cache: "bounded",
  });

  await server.start(); // Ensure the server is started before applying middleware
  server.applyMiddleware({ app });

  // Ensure that the MONGO_URI is defined
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error("MongoDB URI is not defined");
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Adjust the timeout here
      socketTimeoutMS: 45000, // Adjust the socket timeout here
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }

  // const storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, UPLOAD_DIR);
  //   },
  //   filename: (req, file, cb) => {
  //     console.log(file);
  //     cb(null, file.originalname);
  //   },
  // });

  app.post("/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const file = req.file;
      const originalname = file.originalname;
      const buffer = file.buffer;

      // Upload file to Firebase Storage
      const filename = originalname;
      const fileUpload = bucket.file(filename);

      await fileUpload.save(buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Get the uploaded file URL
      const [url] = await fileUpload.getSignedUrl({
        action: "read",
        expires: "01-01-2500",
      });

      console.log("File uploaded to Firebase Storage:", url);
      res.json({ filePath: url });
    } catch (error) {
      console.error("Error uploading file to Firebase Storage:", error);
      res.status(500).json({ error: "Failed to upload file." });
    }
  });

  const port = process.env.PORT || 4000;
  app.listen({ port }, () =>
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
  );
})();
