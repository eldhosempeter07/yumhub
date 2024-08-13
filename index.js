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
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

(async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

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

  await server.start();
  server.applyMiddleware({ app });

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error("MongoDB URI is not defined");
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }

  app.post("/create-checkout-session", async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.items.map((item) => {
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
              },
              unit_amount: item.price * 100,
            },
            quantity: item.quantity,
          };
        }),

        success_url:
          process.env.NODE_ENV === "production"
            ? "https://yum-hub-683741ba0e1d.herokuapp.com/success"
            : "http://localhost:3000/success",
        cancel_url:
          process.env.NODE_ENV === "production"
            ? "https://yum-hub-683741ba0e1d.herokuapp.com/checkout"
            : "http://localhost:3000/checkout",
      });
      res.json({ url: session.url });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

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

      res.json({ filePath: url });
    } catch (error) {
      console.error("Error uploading file to Firebase Storage:", error);
      res.status(500).json({ error: "Failed to upload file." });
    }
  });

  const port = process.env.PORT || 4000;
  if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  }
  app.listen({ port }, () =>
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
  );
})();
