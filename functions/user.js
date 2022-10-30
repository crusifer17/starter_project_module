const functions = require("firebase-functions");
const express = require("express");

const admin = require("firebase-admin");

const app = express();
var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.get("/hello-world", (req, res) => {
  return res.status(200).json({
    message: "Hello World New",
  });
});

app.post("/api/users", async (req, res) => {
  try {
    await db
      .collection("users")
      .doc("/" + req.body.id + "/")
      .create({
        name: req.body.name,
      });

    return res.status(204).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Create Failed",
    });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const query = db.collection("users");
    const listOfElements = await query.get();

    const docs = listOfElements.docs;

    const response = docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const query = db.collection("users");
    const listOfElements = await query.get();

    const docs = listOfElements.docs;

    const response = docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.app = functions.https.onRequest(app);
