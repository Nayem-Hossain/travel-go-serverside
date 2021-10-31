require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@travelgo-cluster.5yple.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);
/* client.connect((err) => {
  const collection = client.db(process.env.DB_NAME).collection("orders");
  // perform actions on the collection object
  client.close();
}); */

async function run() {
  try {
    await client.connect();
    console.log('nayem')
    const database = client.db(process.env.DB_NAME);
    const servicesCollection = database.collection("services");

    // GET ALL SERVICES API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // GET SINGLE SERVICES API

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // console.log(`A document was inserted with the _id: ${result.insertedId}`)
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to travelGo Server");
});

app.listen(port, () => {
  console.log(`travelGo Server listening at http://localhost:${port}`);
});
