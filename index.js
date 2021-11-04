const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cvpyv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Main Async Function
async function run() {
  try {
    await client.connect();
    // console.log('Successfully Connected');
    const database = client.db("tripPackages");
    const packageCollection = database.collection("packages");
    const orderCollection = database.collection("orders");

    //GET Srvices API
    app.get("/packages", async (req, res) => {
      const cursor = packageCollection.find({});
      const packages = await cursor.toArray();
      res.json(packages);
    });

    //GET Users API
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    });

    //Get Single Service
    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Getting Single Service", id);
      const query = { _id: ObjectId(id) };
      const package = await packageCollection.findOne(query);
      res.json(package);
    });

    //POST API For Services
    app.post("/packages", async (req, res) => {
      const package = req.body;
      const result = await packageCollection.insertOne(package);
      console.log(result);
      res.json(result);
    });

    //POST API For Users
    app.post("/orders", async (req, res) => {
      const user = req.body;
      const result = await orderCollection.insertOne(order);
      console.log(result);
      res.json(result);
    });

    //Get Orders Email
    //Empty(-_-)

    //Delete
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Deleted Order", id);
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      console.log("Deleted", result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//Test The Server Connection
app.get("/", (req, res) => {
  res.send("Running Tour Server.");
});

//Testing Dummy Query Search
//http://localhost:5000/contacts?search=selina

const contacts = [
  { id: 0, name: "John", number: "+880 77 88 91" },
  { id: 1, name: "Roman", number: "+880 77 88 92" },
  { id: 2, name: "Selina", number: "+880 77 88 93" },
];

app.get("/contacts", (req, res) => {
  const search = req.query.search;
  console.log(search);
  if (search) {
    const searchResult = contacts.filter((contact) =>
      contact.name.toLocaleLowerCase().includes(search)
    );
    res.send(searchResult);
  } else {
    res.send(contacts);
  }
});

app.listen(port, () => {
  console.log("Welcome to PORT", port);
});
