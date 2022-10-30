const functions = require("firebase-functions");
const express = require("express");

const admin = require("firebase-admin");

const app = express();
var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();


app.post("/api/products", async (req, res) => {
  try {
    await db
      .collection("products")
      .doc("/" + req.body.id + "/")
      .create({
        name: req.body.name,
      });

    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Create Failed",
    });
  }
});

app.get("/api/products/:product_id", async (req, res) => {
    try {
      const doc = db.collection("products").doc(req.params.product_id);
      const item = await doc.get();
      const response = item.data();

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        error: "Get Failed",
      });
    }
});


app.get("/api/products", async (req, res) => {
  try {
    const query = db.collection("products");
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

app.delete("/api/products/:product_id", async (req, res) => {
  try {
    const product = db.collection("products").doc(req.params.product_id);
    await product.delete();
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({
      error: "Delete Failed",
    });
  }
});

app.put("/api/products/:product_id", async (req, res) => {
  try {
    const product = db.collection("products").doc(req.params.product_id);
    await product.update({
      name: req.body.name,
    });

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({
      error: "Delete Failed",
    });
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
