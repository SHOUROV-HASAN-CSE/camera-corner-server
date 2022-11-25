const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;



// Middleware
app.use(cors());
app.use(express.json());


//Mongodb connect
const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.secdjxe.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });






app.get('/',(req, res) =>{
  res.send('Camera Corner Server is Running.......');
});


app.listen(port, () =>{
  console.log(`Camera Corner Server running on ${port} port`);
});